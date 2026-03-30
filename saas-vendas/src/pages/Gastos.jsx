import React, { useState, useEffect, useCallback } from 'react';
import { gastosService } from '../services/api';
import Button    from '../components/ui/Button';
import Input     from '../components/ui/Input';
import FilterBar from '../components/ui/FilterBar';
import { useFilters } from '../hooks/useFilters';
import { SkeletonTableRow } from '../components/ui/Loading';
import styles from './Transacao.module.css';

const brl     = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
const fmtDate = iso => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
const hoje    = () => new Date().toISOString().split('T')[0];

const IcoPlus = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
  </svg>
);

const IcoTrash = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
  </svg>
);

const EmptyState = ({ texto }) => (
  <div className={styles.empty}>
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="8" y="10" width="32" height="34" rx="4"/>
      <path d="M16 22h16M16 30h10"/>
    </svg>
    <p>{texto}</p>
    <span>Use o formulário acima para adicionar o primeiro registro.</span>
  </div>
);

export default function Gastos({ toast }) {
  const [form, setForm]           = useState({ valor: '', descricao: '', data: hoje() });
  const [erros, setErros]         = useState({});
  const [enviando, setEnviando]   = useState(false);
  const [gastos, setGastos]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deletando, setDeletando] = useState(null);

  const { mes, ano, setMes, setAno, limpar } = useFilters();

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await gastosService.listar({ mes, ano });
      setGastos(dados?.gastos ?? []);
    } catch (e) {
      toast.error(e.message || 'Erro ao carregar gastos.');
    } finally {
      setLoading(false);
    }
  }, [mes, ano]);

  useEffect(() => { buscar(); }, [buscar]);

  const validar = () => {
    const e = {};
    if (!form.descricao.trim())           e.descricao = 'Informe a descrição';
    if (!form.valor || +form.valor <= 0)  e.valor     = 'Informe um valor válido';
    if (!form.data)                       e.data      = 'Selecione a data';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      await gastosService.criar({ valor: +form.valor, descricao: form.descricao.trim(), data: form.data });
      toast.success('Gasto registrado com sucesso!');
      setForm({ valor: '', descricao: '', data: hoje() });
      setErros({});
      buscar();
    } catch (err) {
      toast.error(err.message || 'Erro ao registrar gasto.');
    } finally {
      setEnviando(false);
    }
  };

  const handleDeletar = async id => {
    if (!window.confirm('Remover este gasto?')) return;
    setDeletando(id);
    try {
      await gastosService.deletar(id);
      toast.success('Gasto removido.');
      setGastos(g => g.filter(x => x._id !== id));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeletando(null);
    }
  };

  const total = gastos.reduce((s, g) => s + g.valor, 0);

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader + ' anim-fade-up'}>
        <div>
          <h2 className={styles.pageTitle}>Gastos</h2>
          <p className={styles.pageSubtitle}>Controle suas despesas operacionais</p>
        </div>
      </div>

      {/* ── Formulário ── */}
      <div className={styles.formCard + ' anim-fade-up d-1'}>
        <h3 className={styles.formTitle}>
          <span className={styles.formTitleIcon + ' ' + styles['formTitleIcon--rosa']}>
            <IcoPlus />
          </span>
          Novo gasto
        </h3>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.fields}>
            <Input
              label="Valor (R$)"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={form.valor}
              onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
              error={erros.valor}
              disabled={enviando}
              prefix="R$"
            />
            <Input
              label="Descrição"
              type="text"
              placeholder="Ex: Compra de insumos"
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              error={erros.descricao}
              disabled={enviando}
              className={styles.fieldWide}
            />
            <Input
              label="Data"
              type="date"
              value={form.data}
              onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
              error={erros.data}
              disabled={enviando}
            />
          </div>
          <div className={styles.formAction}>
            <Button type="submit" variant="primary" loading={enviando} icon={<IcoPlus />}>
              Registrar gasto
            </Button>
          </div>
        </form>
      </div>

      {/* ── Lista ── */}
      <div className={styles.listSection + ' anim-fade-up d-2'}>
        <div className={styles.listHeader}>
          <div>
            <h3 className={styles.listTitle}>Histórico de gastos</h3>
            <p className={styles.listSub}>{gastos.length} {gastos.length === 1 ? 'registro' : 'registros'}</p>
          </div>
          <FilterBar mes={mes} ano={ano} onMes={setMes} onAno={setAno} onLimpar={limpar} />
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            [0,1,2,3].map(i => <SkeletonTableRow key={i} />)
          ) : gastos.length === 0 ? (
            <EmptyState texto="Nenhum gasto encontrado." />
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th className={styles.right}>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((g, i) => (
                  <tr key={g._id} className={`anim-fade-up d-${Math.min(i + 1, 5)}`}>
                    <td><span className={styles.dateBadge}>{fmtDate(g.data)}</span></td>
                    <td className={styles.descCell}>{g.descricao}</td>
                    <td className={styles.right}>
                      <span className={styles.valorGasto}>{brl(g.valor)}</span>
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeletar(g._id)}
                        disabled={deletando === g._id}
                        title="Remover"
                      >
                        {deletando === g._id
                          ? <div className={styles.miniSpinner} />
                          : <IcoTrash />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {gastos.length > 0 && (
            <div className={styles.totalRow}>
              <span>Total de {gastos.length} {gastos.length === 1 ? 'gasto' : 'gastos'}</span>
              <span className={styles.totalValor + ' ' + styles.rosa}>{brl(total)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
