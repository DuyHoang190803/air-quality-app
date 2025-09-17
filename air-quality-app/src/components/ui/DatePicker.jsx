import React from 'react';
import styles from './DatePicker.module.css';

/**
 * DatePicker - Reusable date input component
 * @param {string} label - Label text for the date picker
 * @param {Date|string} value - Date value
 * @param {function} onChange - Change handler function
 * @param {Date|string} min - Minimum date
 * @param {Date|string} max - Maximum date
 * @param {string} className - Additional CSS classes
 * @param {boolean} required - Whether the field is required
 * @param {boolean} disabled - Whether the date picker is disabled
 */
const DatePicker = ({
    label,
    value,
    onChange,
    min,
    max,
    className = '',
    required = false,
    disabled = false,
    ...props
}) => {
    // Convert Date to string format for input
    const formatDateForInput = (date) => {
        if (!date) return '';
        
        if (date instanceof Date && !isNaN(date)) {
            return date.toISOString().split('T')[0];
        }
        
        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate)) {
                return parsedDate.toISOString().split('T')[0];
            }
        }
        
        return '';
    };

    const handleChange = (e) => {
        if (onChange) {
            const dateValue = e.target.value ? new Date(e.target.value) : null;
            onChange(dateValue);
        }
    };

    return (
        <div className={`${styles['datepicker-container']} ${className}`}>
            {label && (
                <label className={styles['datepicker-label']}>
                    {label}
                    {required && <span className={styles['required']}>*</span>}
                </label>
            )}
            <input
                type="date"
                value={formatDateForInput(value)}
                onChange={handleChange}
                min={formatDateForInput(min)}
                max={formatDateForInput(max)}
                className={styles['datepicker-input']}
                required={required}
                disabled={disabled}
                {...props}
            />
        </div>
    );
};

export default DatePicker;