import React, { useState, useMemo } from 'react';
import { useHistoricalData } from '../../../hooks/useHistoricalData';
import { useAppContext } from '../../../contexts/AppContext.jsx';
import { Button } from '../../ui/Button';
import SearchBar from '../../common/SearchBar';
import DataTable from '../../ui/DataTable';
import Dropdown from '../../ui/Dropdown';
import DatePicker from '../../ui/DatePicker';
import Loading from '../../ui/Loading';
import { Modal } from '../../ui/Modal';
import HistoricalChart from '../charts/HistoricalChart';
import { formatDate, calculateAQI } from '../../../utils/helpers';
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

    const { historicalData, loading: historicalLoading, fetchHistoricalData } = useHistoricalData();

    // Handler functions
    const handleViewHistory = async (station) => {
        setSelectedStation(station);

        // Reset dateRange to default values if they are invalid
        const now = new Date();
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        if (!dateRange.from || !dateRange.to ||
            !(dateRange.from instanceof Date) || !(dateRange.to instanceof Date) ||
            isNaN(dateRange.from) || isNaN(dateRange.to)) {
            setDateRange({
                from: weekAgo,
                to: now
            });
        }

        setShowHistoryModal(true);

        await fetchHistoricalData(station.id, {
            from: dateRange.from && !isNaN(dateRange.from) ? dateRange.from : weekAgo,
            to: dateRange.to && !isNaN(dateRange.to) ? dateRange.to : now
        }, dataType);
    };

    // Define actions for DataTable
    const stationsActions = {
        buttons: [
            {
                label: 'View History',
                onClick: handleViewHistory,
                variant: 'primary',
                size: 'small'
            }
        ]
    };

    // Define columns for stations table
    const stationsColumns = [
        {
            key: 'name',
            title: 'Station Name',
            sortable: true,
            render: (station) => (
                <span style={{ fontWeight: 600, color: '#1f2937' }}>
                    {station.name}
                </span>
            )
        },
        {
            key: 'provider',
            title: 'Provider',
            sortable: true
        },
        {
            key: 'aqi',
            title: 'AQI',
            sortable: true,
            render: (station) => {
                const aqiInfo = calculateAQI(station.data);
                return (
                    <span
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: aqiInfo.color,
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '12px'
                        }}
                    >
                        {aqiInfo.aqi !== null ? aqiInfo.aqi : 'No Record'}
                    </span>
                );
            }
        },
        {
            key: 'data.airPm25',
            title: 'PM2.5',
            sortable: true,
            render: (station) => (
                <span style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', fontWeight: 500 }}>
                    {station.data?.airPm25 || 'No Record'}
                </span>
            )
        },
        {
            key: 'data.airPm10',
            title: 'PM10',
            sortable: true,
            render: (station) => (
                <span style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', fontWeight: 500 }}>
                    {station.data?.airPm10 || 'No Record'}
                </span>
            )
        },
        {
            key: 'data.airNo2',
            title: 'NO2',
            sortable: true,
            render: (station) => (
                <span style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', fontWeight: 500 }}>
                    {station.data?.airNo2 || 'No Record'}
                </span>
            )
        },
        {
            key: 'data.airSo2',
            title: 'SO2',
            sortable: true,
            render: (station) => (
                <span style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', fontWeight: 500 }}>
                    {station.data?.airSo2 || 'No Record'}
                </span>
            )
        },
        {
            key: 'data.airO3',
            title: 'O3',
            sortable: true,
            render: (station) => (
                <span style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', fontWeight: 500 }}>
                    {station.data?.airO3 || 'No Record'}
                </span>
            )
        }
    ];

    // Define columns for historical data table
    const historicalColumns = [
        {
            key: 'timestamp',
            title: 'Time',
            render: (record) => formatDate(new Date(record.timestamp)) || 'No Record'
        },
        {
            key: 'aqi',
            title: 'AQI',
            render: (record) => {
                const aqiInfo = calculateAQI(record);
                return (
                    <span
                        style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: aqiInfo.color,
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '12px'
                        }}
                    >
                        {aqiInfo.aqi !== null ? aqiInfo.aqi : 'No Record'}
                    </span>
                );
            }
        },
        {
            key: 'airPm25',
            title: 'PM2.5',
            render: (record) => record.airPm25 || 'No Record'
        },
        {
            key: 'airPm10',
            title: 'PM10',
            render: (record) => record.airPm10 || 'No Record'
        },
        {
            key: 'airNo2',
            title: 'NO2',
            render: (record) => record.airNo2 || 'No Record'
        },
        {
            key: 'airSo2',
            title: 'SO2',
            render: (record) => record.airSo2 || 'No Record'
        },
        {
            key: 'airO3',
            title: 'O3',
            render: (record) => record.airO3 || 'No Record'
        }
    ];

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

    const handleDateRangeChange = async () => {
        // Validation: Check if dates are valid
        if (!dateRange.from || !dateRange.to ||
            !(dateRange.from instanceof Date) || !(dateRange.to instanceof Date) ||
            isNaN(dateRange.from) || isNaN(dateRange.to)) {
            alert('Please select valid From and To dates!');
            return;
        }

        // Validation: To date must be later than From date
        if (dateRange.to <= dateRange.from) {
            alert('To date must be later than From date!');
            return;
        }

        if (selectedStation) {
            await fetchHistoricalData(selectedStation.id, {
                from: dateRange.from,
                to: dateRange.to
            }, dataType);
        }
    };

    const handleResetDateRange = () => {
        setDateRange({
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            to: new Date()
        });
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

            <DataTable
                data={sortedStations}
                columns={stationsColumns}
                actions={stationsActions}
                isLoading={false}
                emptyMessage="No stations found"
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
                            <DatePicker
                                label="From:"
                                value={dateRange.from}
                                onChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                                max={dateRange.to}
                            />
                            <DatePicker
                                label="To:"
                                value={dateRange.to}
                                onChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                                min={dateRange.from}
                            />
                        </div>
                        <div className={styles['data-type']}>
                            <Dropdown
                                label="Data Type:"
                                value={dataType}
                                onChange={setDataType}
                                options={[
                                    { value: 'hourly', label: 'Hourly' },
                                    { value: 'daily', label: 'Daily' }
                                ]}
                            />
                        </div>
                        <Button 
                            onClick={handleDateRangeChange} 
                            loading={historicalLoading} 
                            size='small'
                            ariaLabel="Update historical data with selected date range"
                        >
                            Update
                        </Button>
                        <Button 
                            onClick={handleResetDateRange} 
                            variant="outline" 
                            size='small'
                            ariaLabel="Reset date range to default values"
                        >
                            Reset
                        </Button>
                    </div>

                    {historicalLoading ? (
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


                                    <DataTable
                                        data={historicalData}
                                        columns={historicalColumns}
                                        isLoading={false}
                                        emptyMessage="No historical data available"
                                    />
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
