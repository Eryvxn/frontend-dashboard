import React from 'react';
import styles from './FilterBar.module.css';

const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
];

const anos = () => {
  const now = new Date().getFullYear();
  return [now - 2, now - 1, now, now + 1];
};

export default function FilterBar({ mes, ano, onMes, onAno, onLimpar }) {
  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Mês</label>
          <select className={styles.select} value={mes} onChange={e => onMes(e.target.value)}>
            <option value="">Todos</option>
            {MESES.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Ano</label>
          <select className={styles.select} value={ano} onChange={e => onAno(Number(e.target.value))}>
            {anos().map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {(mes || ano) && (
        <button className={styles.clear} onClick={onLimpar}>
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
          Limpar filtros
        </button>
      )}
    </div>
  );
}
