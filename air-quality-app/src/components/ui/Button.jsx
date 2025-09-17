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
 * @param {string} props.type - Button type ('button' | 'submit' | 'reset')
 * @param {string} props.ariaLabel - Aria label for accessibility
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button', // Thêm type mặc định
  ariaLabel, // Thêm aria-label support
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
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <span className={styles['btn__spinner']}></span>}
      <span className={loading ? styles['btn__text--loading'] : styles['btn__text']}>
        {children}
      </span>
    </button>
  );
};