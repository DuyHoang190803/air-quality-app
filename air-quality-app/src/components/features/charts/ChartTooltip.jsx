import React from 'react';
import { calculateAQI } from '../../../utils/helpers';
import styles from './ChartTooltip.module.css';

/**
 * ChartTooltip - Reusable tooltip component for charts
 * @param {boolean} active - Whether tooltip is active
 * @param {Array} payload - Chart data payload
 * @param {string} label - Chart label (timestamp)
 * @param {Array} chartData - Full chart data for AQI calculation
 */
const ChartTooltip = ({ active, payload, label, chartData = [] }) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

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
                        AQI: {aqiInfo.aqi !== null ? aqiInfo.aqi : 'No Record'}
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
                    {`${entry.dataKey}: ${entry.value ? entry.value.toFixed(2) : 'No Record'} µg/m³`}
                </p>
            ))}
        </div>
    );
};

export default ChartTooltip;