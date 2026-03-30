import React from 'react';
import styles from './Input.module.css';

/**
 * Input / Select reutilizável.
 * Suporta type="text", "number", "date", "email", "password" e "select".
 */
export default function Input({
  label,
  id,
  type = 'text',
  error,
  hint,
  prefix,
  className = '',
  children, // para selects
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={[styles.group, className].join(' ')}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={[styles.wrapper, error ? styles['wrapper--error'] : ''].join(' ')}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        {type === 'select' ? (
          <select id={inputId} className={styles.input} {...props}>
            {children}
          </select>
        ) : (
          <input id={inputId} type={type} className={styles.input} {...props} />
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
