import React from 'react';
import styles from './Modal.module.css';

/**
 * Modal Component - Modal dialog reusable
 * @param {Object} props
 * @param {boolean} props.isOpen - Trạng thái mở/đóng modal
 * @param {function} props.onClose - Callback khi đóng modal
 * @param {string} props.title - Tiêu đề modal
 * @param {React.ReactNode} props.children - Nội dung modal
 * @param {string} props.size - Kích thước modal ('small' | 'medium' | 'large')
 */
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium' 
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles['modal-backdrop']} onClick={handleBackdropClick}>
      <div className={`${styles.modal} ${styles[`modal--${size}`]}`}>
        <div className={styles['modal__header']}>
          <h3 className={styles['modal__title']}>{title}</h3>
          <button 
            className={styles['modal__close']}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className={styles['modal__content']}>
          {children}
        </div>
      </div>
    </div>
  );
};