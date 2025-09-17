import React from 'react';
import { Button } from './Button';
import styles from './DataTable.module.css';

/**
 * DataTable - Reusable table component with sorting functionality
 * @param {Array} data - Array of data objects to display
 * @param {Array} columns - Array of column definitions
 * @param {Object} sortConfig - Current sort configuration {key, direction}
 * @param {Function} onSort - Sort handler function
 * @param {Object} actions - Optional actions configuration
 * @param {string} className - Optional additional CSS class
 */
const DataTable = ({
    data = [],
    columns = [],
    sortConfig = null,
    onSort = null,
    actions = null,
    className = '',
    emptyMessage = 'No data available',
    isLoading = false
}) => {
    const getSortIcon = (key) => {
        if (!sortConfig || sortConfig.key !== key) return '⇅';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handleSort = (key) => {
        if (onSort && key) {
            onSort(key);
        }
    };

    if (isLoading) {
        return (
            <div className={`${styles['table-container']} ${className}`}>
                <div className={styles['empty-state']}>
                    Loading...
                </div>
            </div>
        );
    }

    const renderCellContent = (item, column) => {
        if (column.render) {
            return column.render(item, item[column.key]);
        }

        // Handle nested keys (e.g., 'data.airPm25')
        if (column.key.includes('.')) {
            const keys = column.key.split('.');
            const value = keys.reduce((obj, key) => obj?.[key], item);
            return value !== null && value !== undefined ? value : 'No Record';
        }

        return item[column.key] !== null && item[column.key] !== undefined ? item[column.key] : 'No Record';
    };

    if (!data.length) {
        return (
            <div className={`${styles['table-container']} ${className}`}>
                <div className={styles['empty-state']}>
                    {emptyMessage}
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles['table-container']} ${className}`}>
            <table className={styles['data-table']}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                onClick={() => column.sortable && handleSort(column.key)}
                                className={`${column.sortable ? styles.sortable : ''} ${column.className || ''}`}
                                style={column.style}
                            >
                                {column.title}
                                {column.sortable && sortConfig && (
                                    <span className={styles['sort-icon']}>
                                        {getSortIcon(column.key)}
                                    </span>
                                )}
                            </th>
                        ))}
                        {actions && <th className={styles['actions-column']}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={item.id || index}>
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={column.cellClassName || ''}
                                    style={column.cellStyle}
                                >
                                    {renderCellContent(item, column)}
                                </td>
                            ))}
                            {actions && (
                                <td className={styles['actions-cell']}>
                                    {actions.buttons?.map((action, actionIndex) => (
                                        <Button
                                            key={actionIndex}
                                            onClick={() => action.onClick(item)}
                                            variant={action.variant || 'outline'}
                                            size={action.size || 'small'}
                                            className={action.className}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;