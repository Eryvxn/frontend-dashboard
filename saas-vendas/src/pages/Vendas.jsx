import React, { useState, useEffect, useCallback } from 'react';
import { vendasService } from '../services/api';
import Button    from '../components/ui/Button';
import Input     from '../components/ui/Input';
import FilterBar from '../components/ui/FilterBar';
import { useFilters } from '../hooks/useFilters';
import { SkeletonTableRow } from '../components/ui/Loading';
import styles from './Transacao.module.css';

const brl = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);
const fmtDate = iso => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
const hoje = () => new Date().toISOString().split('T')[0];

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
      <circle cx="36" cy="12" r="8" fill="var(--bg)" stroke="var(--border-strong)" strokeWidth="1.5"/>
      <path d="M33 12h6M36 9v6" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <p>{texto}</p>
    <span>Use o formulário acima para adicionar o primeiro registro.</span>
  </div>
);

export default function Vendas({ toast }) {
  const [form, setForm]           = useState({ valor: '', descricao: '', data: hoje() });
  const [erros, setErros]         = useState({});
  const [enviando, setEnviando]   = useState(false);
  const [vendas, setVendas]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deletando, setDeletando] = useState(null);

  const { mes, ano, setMes, setAno, limpar } = useFilters();

  const buscar = useCallback(async () => {
    setLoading(true);
    try {
      const dados = await vendasService.listar({ mes, ano });
      setVendas(dados?.vendas ?? []);
    } catch (e) {
      toast.error(e.message || 'Erro ao carregar vendas.');
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

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    try {
      await vendasService.criar({ valor: +form.valor, descricao: form.descricao.trim(), data: form.data });
      toast.success('Venda registrada com sucesso!');
      setForm({ valor: '', descricao: '', data: hoje() });
      setErros({});
      buscar();
    } catch (err) {
      toast.error(err.message || 'Erro ao registrar venda.');
    } finally {
      setEnviando(false);
    }
  };

  const handleDeletar = async id => {
    if (!window.confirm('Remover esta venda?')) return;
    setDeletando(id);
    try {
      await vendasService.deletar(id);
      toast.success('Venda removida.');
      setVendas(v => v.filter(x => x._id !== id));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeletando(null);
    }
  };

  const total = vendas.reduce((s, v) => s + v.valor, 0);

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.pageHeader + ' anim-fade-up'}>
        <div>
          <h2 className={styles.pageTitle}>Vendas</h2>
          <p className={styles.pageSubtitle}>Registre e acompanhe suas vendas</p>
        </div>
      </div>

      {/* ── Formulário ── */}
      <div className={styles.formCard + ' anim-fade-up d-1'}>
        <h3 className={styles.formTitle}>
          <span className={styles.formTitleIcon + ' ' + styles['formTitleIcon--verde']}>
            <IcoPlus />
          </span>
          Nova venda
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
              placeholder="Ex: Vendas da manhã"
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
              Registrar venda
            </Button>
          </div>
        </form>
      </div>

      {/* ── Lista ── */}
      <div className={styles.listSection + ' anim-fade-up d-2'}>
        <div className={styles.listHeader}>
          <div>
            <h3 className={styles.listTitle}>Histórico</h3>
            <p className={styles.listSub}>{vendas.length} {vendas.length === 1 ? 'registro' : 'registros'}</p>
          </div>
          <FilterBar mes={mes} ano={ano} onMes={setMes} onAno={setAno} onLimpar={limpar} />
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            [0,1,2,3].map(i => <SkeletonTableRow key={i} />)
          ) : vendas.length === 0 ? (
            <EmptyState texto="Nenhuma venda encontrada." />
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
                {vendas.map((v, i) => (
                  <tr key={v._id} className={`anim-fade-up d-${Math.min(i + 1, 5)}`}>
                    <td><span className={styles.dateBadge}>{fmtDate(v.data)}</span></td>
                    <td className={styles.descCell}>{v.descricao}</td>
                    <td className={styles.right}>
                      <span className={styles.valorVenda}>{brl(v.valor)}</span>
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeletar(v._id)}
                        disabled={deletando === v._id}
                        title="Remover"
                      >
                        {deletando === v._id
                          ? <div className={styles.miniSpinner} />
                          : <IcoTrash />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {vendas.length > 0 && (
            <div className={styles.totalRow}>
              <span>Total de {vendas.length} {vendas.length === 1 ? 'venda' : 'vendas'}</span>
              <span className={styles.totalValor + ' ' + styles.verde}>{brl(total)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
