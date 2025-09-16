import React from 'react';
import styles from './Loading.module.css';

/**
 * Loading Component - Hiển thị trạng thái loading
 * @param {Object} props
 * @param {string} props.message - Thông điệp loading
 * @param {string} props.size - Kích thước ('small' | 'medium' | 'large')
 */
const Loading = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className={`${styles.loading} ${styles[`loading--${size}`]}`}>
      <div className={styles['loading__spinner']}>
        <div className={styles['loading__dot']}></div>
        <div className={styles['loading__dot']}></div>
        <div className={styles['loading__dot']}></div>
      </div>
      {message && <p className={styles['loading__message']}>{message}</p>}
    </div>
  );
};

export default Loading;