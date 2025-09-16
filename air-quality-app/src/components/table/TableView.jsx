import React, { useState, useMemo } from 'react';
import { useHistoricalData } from '../../hooks/useHistoricalData';
import { useAppContext } from '../../contexts/AppContext.jsx';
import { Button } from '../ui/Button';
import SearchBar from '../common/SearchBar';
import StationsTable from './StationsTable';
import Loading from '../ui/Loading';
import { Modal } from '../ui/Modal';
import HistoricalChart from '../charts/HistoricalChart';
import { formatDate } from '../../utils/helpers';
import styles from './TableView.module.css';



const TableView = () => {
    const { stations } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [selectedStation, setSelectedStation] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        to: new Date()
    });
    const [dataType, setDataType] = useState('hourly');

    const { historicalData, loading: historyLoading, fetchHistoricalData } = useHistoricalData();

    // Filter stations based on search query
    const filteredStations = useMemo(() => {
        if (!stations || !Array.isArray(stations)) return [];
        return stations.filter(station =>
            station.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [stations, searchQuery]);

    // Sort stations
    const sortedStations = useMemo(() => {
        return [...filteredStations].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle nested measurements
            if (sortConfig.key.includes('.')) {
                const keys = sortConfig.key.split('.');
                aValue = keys.reduce((obj, key) => obj?.[key], a);
                bValue = keys.reduce((obj, key) => obj?.[key], b);
            }

            // Convert to numbers if possible
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                aValue = aNum;
                bValue = bNum;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredStations, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleViewHistory = async (station) => {
        setSelectedStation(station);
        setShowHistoryModal(true);

        await fetchHistoricalData(station.id, {
            from: dateRange.from,
            to: dateRange.to
        }, dataType);
    };

    const handleDateRangeChange = async () => {
        // Validation: To date cannot be earlier than From date
        if (dateRange.to < dateRange.from) {

            alert('To date cannot be earlier or equal to From date!');
            return;
        }

        if (selectedStation) {
            await fetchHistoricalData(selectedStation.id, {
                from: dateRange.from,
                to: dateRange.to
            }, dataType);
        }
    };



    return (
        <div className={styles['table-view']}>
            <div className={styles['table-view__header']}>
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder="Search stations..."
                />
            </div>

            <StationsTable
                stations={sortedStations}
                sortConfig={sortConfig}
                onSort={handleSort}
                onViewHistory={handleViewHistory}
                searchQuery={searchQuery}
            />


            {/* Historical Data Modal */}
            <Modal
                isOpen={showHistoryModal}
                onClose={() => setShowHistoryModal(false)}
                title={`Historical Data - ${selectedStation?.name}`}
                size="large"
            >
                <div className={styles['history-modal']}>
                    <div className={styles['history-controls']}>
                        <div className={styles['date-range']}>
                            <label>
                                From:
                                <input
                                    type="date"
                                    value={dateRange.from.toISOString().split('T')[0]}
                                    max={dateRange.to.toISOString().split('T')[0]}
                                    onChange={(e) => setDateRange(prev => ({
                                        ...prev,
                                        from: new Date(e.target.value)
                                    }))}
                                />
                            </label>
                            <label>
                                To:
                                <input
                                    type="date"
                                    value={dateRange.to.toISOString().split('T')[0]}
                                    min={dateRange.from.toISOString().split('T')[0]}
                                    onChange={(e) => setDateRange(prev => ({
                                        ...prev,
                                        to: new Date(e.target.value)
                                    }))}
                                />
                            </label>
                        </div>
                        <div className={styles['data-type']}>
                            <label>
                                Data Type:
                                <select
                                    value={dataType}
                                    onChange={(e) => setDataType(e.target.value)}
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                </select>
                            </label>
                        </div>
                        <Button onClick={handleDateRangeChange} loading={historyLoading} size='small'>
                            Update
                        </Button>
                    </div>

                    {historyLoading ? (
                        <Loading message="Loading historical data..." />
                    ) : (
                        <div className={styles['history-data']}>
                            {historicalData.length > 0 ? (
                                <div>
                                    {/* Historical Chart - Hidden on small devices */}
                                    <div className={styles['chart-wrapper']}>
                                        <HistoricalChart
                                            data={historicalData}
                                            title={`Historical Data - ${selectedStation?.name}`}
                                            height={400}
                                        />
                                    </div>

                                    {/* Data Table */}
                                    <div className={styles['history-table-container']}>
                                        <table className={styles['history-table']}>
                                            <thead>
                                                <tr>
                                                    <th>Time</th>
                                                    <th>PM2.5</th>
                                                    <th>PM10</th>
                                                    <th>NO2</th>
                                                    <th>SO2</th>
                                                    <th>O3</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historicalData.map((record, index) => (
                                                    <tr key={index}>
                                                        <td>{record.timestamp ? formatDate(new Date(record.timestamp)) : 'No Record'}</td>
                                                        <td>{record.airPm25 || 'No Record'}</td>
                                                        <td>{record.airPm10 || 'No Record'}</td>
                                                        <td>{record.airNo2 || 'No Record'}</td>
                                                        <td>{record.airSo2 || 'No Record'}</td>
                                                        <td>{record.airO3 || 'No Record'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles['no-data-container']}>
                                    <div className={styles['no-data-badge']}>
                                        No historical data available for this time range
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default TableView;
