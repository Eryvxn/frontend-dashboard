import React from 'react';
import styles from './Loading.module.css';

/** Spinner centralizado na tela */
export function PageSpinner({ label = 'Carregando…' }) {
  return (
    <div className={styles.pageSpinner}>
      <div className={styles.ring} />
      <span>{label}</span>
    </div>
  );
}

/** Skeleton de linha */
export function SkeletonLine({ width = '100%', height = 16, className = '' }) {
  return (
    <div
      className={`skeleton ${styles.line} ${className}`}
      style={{ width, height }}
    />
  );
}

/** Skeleton de card de métrica */
export function SkeletonMetricCard() {
  return (
    <div className={styles.metricCard}>
      <div className={`skeleton ${styles.iconBox}`} />
      <div className={styles.metricLines}>
        <SkeletonLine width="60%" height={12} />
        <SkeletonLine width="80%" height={28} />
      </div>
    </div>
  );
}

/** Skeleton de linha de tabela */
export function SkeletonTableRow() {
  return (
    <div className={styles.tableRow}>
      <SkeletonLine width="120px" height={14} />
      <SkeletonLine width="40%" height={14} />
      <SkeletonLine width="90px" height={14} />
    </div>
  );
}

/** Overlay de loading inline */
export function InlineSpinner() {
  return <div className={styles.inlineSpinner} />;
}
