import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { formatDate, calculateAQI } from '../../utils/helpers';
import styles from './HistoricalChart.module.css';

/**
 * HistoricalChart Component - Line chart for historical air quality data
 * @param {Object} props
 * @param {Array} props.data - Historical data array
 * @param {string} props.title - Chart title
 * @param {number} props.height - Chart height in pixels
 */
const HistoricalChart = React.memo(({
    data = [],
    title = "Historical Air Quality Data",
    height = 400
}) => {
    // Transform data for Recharts format
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        return data.map(item => ({
            timestamp: item.timestamp ? formatDate(new Date(item.timestamp), 'MMM dd HH:mm') : 'No Data',
            PM25: item.airPm25 ? parseFloat(item.airPm25) : null,
            PM10: item.airPm10 ? parseFloat(item.airPm10) : null,
            NO2: item.airNo2 ? parseFloat(item.airNo2) : null,
            SO2: item.airSo2 ? parseFloat(item.airSo2) : null,
            O3: item.airO3 ? parseFloat(item.airO3) : null,
        })).filter(item => item.timestamp !== 'No Data');
    }, [data]);

    // Custom tooltip formatter
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Calculate AQI from the current data point
            const currentData = chartData.find(item => item.timestamp === label);
            let aqiInfo = null;

            if (currentData) {
                const stationData = {
                    airPm25: currentData.PM25,
                    airPm10: currentData.PM10,
                    airNo2: currentData.NO2,
                    airSo2: currentData.SO2,
                    airO3: currentData.O3
                };
                aqiInfo = calculateAQI(stationData);
            }

            return (
                <div className={styles['custom-tooltip']}>
                    <p className={styles['tooltip-label']}>{`Time: ${label}`}</p>

                    {/* AQI Display */}
                    {aqiInfo && (
                        <div className={styles['tooltip-aqi']}>
                            <span
                                className={styles['tooltip-aqi-badge']}
                                style={{ backgroundColor: aqiInfo.color }}
                            >
                                AQI: {aqiInfo.aqi !== null ? aqiInfo.aqi : 'N/A'}
                            </span>
                            <span className={styles['tooltip-aqi-level']}>
                                {aqiInfo.level}
                            </span>
                        </div>
                    )}

                    {/* Pollutants */}
                    {payload.map((entry, index) => (
                        <p
                            key={index}
                            className={styles['tooltip-item']}
                            style={{ color: entry.color }}
                        >
                            {`${entry.dataKey}: ${entry.value ? entry.value.toFixed(2) : 'N/A'} µg/m³`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (!chartData.length) {
        return (
            <div className={styles['chart-container']}>
                <h3 className={styles['chart-title']}>{title}</h3>
                <div className={styles['no-data']}>
                    <div className={styles['no-data-badge']}>
                        📈 No historical data available for chart visualization
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['chart-container']}>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                    <XAxis
                        dataKey="timestamp"
                        stroke="#6c757d"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        stroke="#6c757d"
                        fontSize={12}
                        label={{ value: 'Concentration (µg/m³)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} />

                    <Line
                        type="monotone"
                        dataKey="PM25"
                        stroke="#dc3545"
                        strokeWidth={2}
                        dot={{ fill: '#dc3545', strokeWidth: 2, r: 4 }}
                        connectNulls={false}
                        name="PM2.5"
                    />
                    <Line
                        type="monotone"
                        dataKey="PM10"
                        stroke="#fd7e14"
                        strokeWidth={2}
                        dot={{ fill: '#fd7e14', strokeWidth: 2, r: 4 }}
                        connectNulls={false}
                        name="PM10"
                    />
                    <Line
                        type="monotone"
                        dataKey="NO2"
                        stroke="#007bff"
                        strokeWidth={2}
                        dot={{ fill: '#007bff', strokeWidth: 2, r: 4 }}
                        connectNulls={false}
                        name="NO₂"
                    />
                    <Line
                        type="monotone"
                        dataKey="SO2"
                        stroke="#28a745"
                        strokeWidth={2}
                        dot={{ fill: '#28a745', strokeWidth: 2, r: 4 }}
                        connectNulls={false}
                        name="SO₂"
                    />
                    <Line
                        type="monotone"
                        dataKey="O3"
                        stroke="#6f42c1"
                        strokeWidth={2}
                        dot={{ fill: '#6f42c1', strokeWidth: 2, r: 4 }}
                        connectNulls={false}
                        name="O₃"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
});

// HistoricalChart.displayName = 'HistoricalChart';

export default HistoricalChart;