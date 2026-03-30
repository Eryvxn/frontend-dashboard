import React from 'react';
import styles from './Card.module.css';

/**
 * Card base reutilizável.
 * variant: 'default' | 'elevated' | 'flat'
 */
export default function Card({ children, variant = 'default', className = '', padding = true, ...props }) {
  return (
    <div
      className={[
        styles.card,
        styles[`card--${variant}`],
        padding ? '' : styles['card--no-pad'],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return <div className={[styles.header, className].join(' ')}>{children}</div>;
};

Card.Title = function CardTitle({ children, className = '' }) {
  return <h3 className={[styles.title, className].join(' ')}>{children}</h3>;
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={[styles.body, className].join(' ')}>{children}</div>;
};
