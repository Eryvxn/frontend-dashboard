import React from 'react';
import styles from './Button.module.css';

/**
 * Button reutilizável.
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  type = 'button',
  disabled,
  onClick,
  className = '',
}) {
  return (
    <button
      type={type}
      className={[
        styles.btn,
        styles[`btn--${variant}`],
        styles[`btn--${size}`],
        fullWidth ? styles['btn--full'] : '',
        loading   ? styles['btn--loading'] : '',
        className,
      ].join(' ')}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon ? (
        <span className={styles.icon}>{icon}</span>
      ) : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
