import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dashboardService } from '../services/api';
import FilterBar from '../components/ui/FilterBar';
import { SkeletonMetricCard } from '../components/ui/Loading';
import styles from './Dashboard.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const brl = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0);

/* ── Ícones ── */
const IcoUp   = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>;
const IcoCoin = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/></svg>;
const IcoDown = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd"/></svg>;

function MetricCard({ label, valor, variante, icon, delay }) {
  return (
    <div className={[styles.metricCard, styles[`metric--${variante}`], `anim-fade-up d-${delay}`].join(' ')}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricBody}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricValor}>{brl(valor)}</span>
      </div>
    </div>
  );
}

export default function Dashboard({ toast }) {
  const [dados,      setDados]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [erro,       setErro]       = useState('');

  useEffect(() => {
    dashboardService.get()
      .then(setDados)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* ── Chart config ── */
  const evolucao = dados?.evolucaoMensal ?? [];
  const labels   = evolucao.map(m => `${m.mes}/${String(m.ano).slice(2)}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Vendas',
        data: evolucao.map(m => m.vendas),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,.08)',
        borderWidth: 2.5,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: .42,
        fill: true,
      },
      {
        label: 'Gastos',
        data: evolucao.map(m => m.gastos),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244,63,94,.06)',
        borderWidth: 2,
        borderDash: [6, 4],
        pointBackgroundColor: '#f43f5e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: .42,
        fill: true,
      },
    ],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          font:         { family: "'Sora', sans-serif", size: 12, weight: '500' },
          color:        '#6b6960',
          boxWidth:     10,
          boxHeight:    10,
          borderRadius: 3,
          usePointStyle: true,
          pointStyle:   'circle',
          padding:      20,
        },
      },
      tooltip: {
        backgroundColor: '#1a1916',
        titleFont:  { family: "'Sora', sans-serif", size: 12, weight: '600' },
        bodyFont:   { family: "'Sora', sans-serif", size: 13 },
        padding:    14,
        cornerRadius: 12,
        borderColor: 'rgba(255,255,255,.08)',
        borderWidth: 1,
        callbacks: { label: ctx => `  ${ctx.dataset.label}: ${brl(ctx.raw)}` },
      },
    },
    scales: {
      x: {
        grid:   { display: false },
        border: { display: false },
        ticks:  { font: { family: "'Sora', sans-serif", size: 12 }, color: '#a8a59e' },
      },
      y: {
        grid:   { color: '#f0efe9', lineWidth: 1 },
        border: { display: false, dash: [4, 4] },
        ticks: {
          font:     { family: "'Sora', sans-serif", size: 11 },
          color:    '#a8a59e',
          callback: v => `R$${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  /* ── Render ── */
  const now = new Date();
  const mesLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader + ' anim-fade-up'}>
        <div>
          <h2 className={styles.pageTitle}>Dashboard</h2>
          <p className={styles.pageSubtitle}>Visão geral do seu negócio</p>
        </div>
        <span className={styles.monthBadge}>{mesLabel}</span>
      </div>

      {/* Métricas */}
      <div className={styles.metricsGrid}>
        {loading ? (
          [0,1,2].map(i => <SkeletonMetricCard key={i} />)
        ) : erro ? (
          <div className={styles.erroMsg}>{erro}</div>
        ) : (
          <>
            <MetricCard label="Vendas do mês"  valor={dados?.totalVendasMes} variante="verde"  icon={<IcoUp />}   delay="1" />
            <MetricCard label="Gastos do mês"  valor={dados?.totalGastosMes} variante="rosa"   icon={<IcoDown />} delay="2" />
            <MetricCard label="Lucro do mês"   valor={dados?.lucroMes}       variante={dados?.lucroMes >= 0 ? 'amber' : 'rosa'} icon={<IcoCoin />} delay="3" />
          </>
        )}
      </div>

      {/* Gráfico */}
      <div className={styles.chartCard + ' anim-fade-up d-4'}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>Evolução mensal</h3>
            <p className={styles.chartSub}>Últimos 6 meses — vendas vs gastos</p>
          </div>
        </div>
        <div className={styles.chartWrap}>
          {loading ? (
            <div className={styles.chartLoading}>
              <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--emerald)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
            </div>
          ) : evolucao.length === 0 ? (
            <div className={styles.chartEmpty}>Nenhum dado disponível ainda.</div>
          ) : (
            <Line data={chartData} options={chartOpts} />
          )}
        </div>
      </div>

      {/* Resumo tabular dos últimos meses */}
      {!loading && evolucao.length > 0 && (
        <div className={styles.tableCard + ' anim-fade-up d-5'}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Detalhamento por mês</h3>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th className={styles.right}>Vendas</th>
                  <th className={styles.right}>Gastos</th>
                  <th className={styles.right}>Lucro</th>
                </tr>
              </thead>
              <tbody>
                {[...evolucao].reverse().map((m, i) => (
                  <tr key={i}>
                    <td><span className={styles.mesBadge}>{m.mes}/{m.ano}</span></td>
                    <td className={styles.right + ' ' + styles.verde}>{brl(m.vendas)}</td>
                    <td className={styles.right + ' ' + styles.rosa}>{brl(m.gastos)}</td>
                    <td className={[styles.right, m.lucro >= 0 ? styles.verde : styles.rosa].join(' ')}>
                      <strong>{brl(m.lucro)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
