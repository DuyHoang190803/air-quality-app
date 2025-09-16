import { Button } from '../ui/Button';
import { calculateAQI } from '../../utils/helpers';
import styles from './StationsTable.module.css';

const StationsTable = ({
    stations,
    sortConfig,
    onSort,
    onViewHistory,
    searchQuery
}) => {

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '⇅';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className={styles['table-container']}>
            <table className={styles['stations-table']}>
                <thead>
                    <tr>
                        <th onClick={() => onSort('name')} className={styles.sortable}>
                            Station Name {getSortIcon('name')}
                        </th>
                        <th onClick={() => onSort('provider')} className={styles.sortable}>
                            Provider {getSortIcon('provider')}
                        </th>
                        <th onClick={() => onSort('aqi')} className={styles.sortable}>
                            AQI {getSortIcon('aqi')}
                        </th>
                        <th onClick={() => onSort('data.airPm25')} className={styles.sortable}>
                            PM2.5 {getSortIcon('data.airPm25')}
                        </th>
                        <th onClick={() => onSort('data.airPm10')} className={styles.sortable}>
                            PM10 {getSortIcon('data.airPm10')}
                        </th>
                        <th onClick={() => onSort('data.airNo2')} className={styles.sortable}>
                            NO2 {getSortIcon('data.airNo2')}
                        </th>
                        <th onClick={() => onSort('data.airSo2')} className={styles.sortable}>
                            SO2 {getSortIcon('data.airSo2')}
                        </th>
                        <th onClick={() => onSort('data.airO3')} className={styles.sortable}>
                            O3 {getSortIcon('data.airO3')}
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {stations.map(station => {
                        const aqiInfo = calculateAQI(station.data);
                        return (
                            <tr
                                key={station.id}
                                className={styles['station-row']}
                            >
                                <td className={styles['station-name']}>{station.name}</td>
                                <td>{station.provider || 'No Provider'}</td>

                                <td className={styles['aqi-value']}>
                                    <span
                                        className={styles['aqi-badge']}
                                        style={{ backgroundColor: aqiInfo.color }}
                                    >
                                        {aqiInfo.aqi !== null ? aqiInfo.aqi : 'N/A'}
                                    </span>

                                </td>
                                <td className={styles['measurement-value']}>
                                    {station.data?.airPm25 ? `${station.data.airPm25} μg/m³` : 'No Record'}
                                </td>
                                <td className={styles['measurement-value']}>
                                    {station.data?.airPm10 ? `${station.data.airPm10} μg/m³` : 'No Record'}
                                </td>
                                <td className={styles['measurement-value']}>
                                    {station.data?.airNo2 ? `${station.data.airNo2} μg/m³` : 'No Record'}
                                </td>
                                <td className={styles['measurement-value']}>
                                    {station.data?.airSo2 ? `${station.data.airSo2} μg/m³` : 'No Record'}
                                </td>
                                <td className={styles['measurement-value']}>
                                    {station.data?.airO3 ? `${station.data.airO3} μg/m³` : 'No Record'}
                                </td>
                                <td>
                                    <Button
                                        size="small"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewHistory(station);
                                        }}
                                    >
                                        History
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {stations.length === 0 && (
                <div className={styles['no-results']}>
                    <div className={styles['no-results-content']}>
                        <div className={styles['no-results-icon']}>🔍</div>
                        <h3>No stations found</h3>
                        <p>No stations found matching the search "{searchQuery}"</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StationsTable;