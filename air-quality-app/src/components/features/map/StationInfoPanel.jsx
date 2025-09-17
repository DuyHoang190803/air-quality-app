import { calculateAQI } from '../../../utils/helpers.js';
import { Button } from '../../ui/Button';
import styles from './StationInfoPanel.module.css';

const StationInfoPanel = ({ station, onClose }) => {
    if (!station) return null;

    const aqiInfo = calculateAQI(station.data);

    return (
        <div className={styles['station-info-panel']}>
            <div className={styles['station-info-panel__header']}>
                <h3>{station.name}</h3>
                <Button
                    variant="ghost"
                    size="small"
                    className={styles['station-info-panel__close']}
                    onClick={onClose}
                    ariaLabel="Close station information panel"
                >
                    ✕
                </Button>
            </div>

            <div className={styles['station-info-panel__content']}>
                {/* AQI Display */}
                <div className={styles['aqi-section']}>
                    <div
                        className={styles['aqi-badge']}
                        style={{ backgroundColor: aqiInfo.color }}
                    >
                        <div className={styles['aqi-value']}>{aqiInfo.aqi}</div>
                        <div className={styles['aqi-label']}>AQI</div>
                    </div>
                    <div className={styles['aqi-info']}>
                        <div className={styles['aqi-level']}>{aqiInfo.level}</div>
                        <div className={styles['aqi-description']}>{aqiInfo.description}</div>
                        {aqiInfo.dominantPollutant && (
                            <div className={styles['dominant-pollutant']}>
                                Dominant Pollutant: {aqiInfo.dominantPollutant}
                            </div>
                        )}
                    </div>
                </div>

                {station.data && (
                    <div className={styles.measurements}>
                        {station?.data?.airPm25 && (
                            <div className={styles.measurement}>
                                <label>PM2.5:</label>
                                <span>{station.data.airPm25} μg/m³</span>
                            </div>
                        )}
                        {station?.data?.airPm10 && (
                            <div className={styles.measurement}>
                                <label>PM10:</label>
                                <span>{station.data.airPm10} μg/m³</span>
                            </div>
                        )}
                        {station?.data?.airNo2 && (
                            <div className={styles.measurement}>
                                <label>NO2:</label>
                                <span>{station.data.airNo2} μg/m³</span>
                            </div>
                        )}
                        {station?.data?.airO3 && (
                            <div className={styles.measurement}>
                                <label>O3:</label>
                                <span>{station.data.airO3} μg/m³</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StationInfoPanel;