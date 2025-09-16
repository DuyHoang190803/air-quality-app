import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component - Reusable button
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button style ('primary' | 'secondary' | 'outline' | 'danger')
 * @param {string} props.size - Button size ('small' | 'medium' | 'large')
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const buttonClass = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    loading && styles['btn--loading'],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className={styles['btn__spinner']}></span>}
      <span className={loading ? styles['btn__text--loading'] : styles['btn__text']}>
        {children}
      </span>
    </button>
  );
};