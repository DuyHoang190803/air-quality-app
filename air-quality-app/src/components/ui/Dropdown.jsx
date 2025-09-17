import React from 'react';
import styles from './Dropdown.module.css';

/**
 * Dropdown - Reusable select dropdown component
 * @param {string} label - Label text for the dropdown
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler function
 * @param {Array} options - Array of options [{value, label}] or [{id, name}]
 * @param {string} placeholder - Placeholder text
 * @param {string} className - Additional CSS classes
 * @param {boolean} required - Whether the field is required
 * @param {boolean} disabled - Whether the dropdown is disabled
 * @param {string} state - Visual state: 'default', 'error', 'success'
 */
const Dropdown = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    className = '',
    required = false,
    disabled = false,
    state = 'default',
    ...props
}) => {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const containerClasses = [
        styles['dropdown-container'],
        state === 'error' ? styles['error'] : '',
        state === 'success' ? styles['success'] : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {label && (
                <label className={styles['dropdown-label']}>
                    {label}
                    {required && <span className={styles['required']}>*</span>}
                </label>
            )}
            <div className={styles['dropdown-wrapper']}>
                <select
                    value={value}
                    onChange={handleChange}
                    className={styles['dropdown-select']}
                    required={required}
                    disabled={disabled}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => {
                        // Support both {value, label} and {id, name} formats
                        const optionValue = option.value || option.id;
                        const optionLabel = option.label || option.name;
                        
                        return (
                            <option key={optionValue} value={optionValue}>
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>
                <svg 
                    className={styles['dropdown-icon']} 
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                >
                    <path 
                        fillRule="evenodd" 
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                    />
                </svg>
            </div>
        </div>
    );
};

export default Dropdown;