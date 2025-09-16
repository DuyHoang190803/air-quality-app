/**
 * Process station data from API
 * @param {Array} rawData - Raw data
 * @returns {Array} Processed data
 */
export const processStationData = (rawData) => {
    return rawData.map(station => ({
        id: station?.id,
        name: station?.name,
        lat: parseFloat(station.lat),
        lng: parseFloat(station.lng),
        provider: station?.provider,
        data: station?.data || {},

    }));
};

/**
 * Process measurement data
 * @param {Object} measurements - Raw measurements from API
 * @returns {Object} Processed measurements
 */
export const processMeasurements = (measurements) => {
    if (!measurements) return {};

    return {
        pm25: parseFloat(measurements.airPm25) || 0,
        pm10: parseFloat(measurements.airPm10) || 0,
        no2: parseFloat(measurements.airNo2) || 0,
        so2: parseFloat(measurements.airSo2) || 0,
        o3: parseFloat(measurements.airO3) || 0,
        temperature: parseFloat(measurements.temperature) || 0,
        humidity: parseFloat(measurements.humidity) || 0,
        pressure: parseFloat(measurements.pressure) || 0,
    };
};


/**
 * Format date for display
 * @param {Date|string|number} date - Date object, string, or timestamp
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';

    try {
        const dateObj = new Date(date);

        // Check if date is invalid
        if (isNaN(dateObj.getTime())) {
            return 'N/A';
        }

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(dateObj);
    } catch (error) {
        console.warn('Invalid date provided to formatDate:', date);
        return 'N/A';
    }
};

/**
 * Normalize string for better search by removing accents and special characters
 * @param {string} str - String to normalize
 * @returns {string} Normalized string
 */
export const normalizeString = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\w\s]/g, ' ')        // Replace special chars with space
        .replace(/\s+/g, ' ')            // Replace multiple spaces with single
        .trim();
};

/**
 * Calculate AQI (Air Quality Index) for a specific pollutant
 * @param {number} concentration - Pollutant concentration
 * @param {string} pollutant - Pollutant type (pm25, pm10, no2, so2, o3)
 * @returns {number} AQI value
 */
export const calculatePollutantAQI = (concentration, pollutant) => {
    if (!concentration || concentration < 0) return 0;

    const breakpoints = {
        pm25: [
            { cLow: 0, cHigh: 12, aqiLow: 0, aqiHigh: 50 },
            { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
            { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
            { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
            { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
            { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 }
        ],
        pm10: [
            { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
            { cLow: 55, cHigh: 154, aqiLow: 51, aqiHigh: 100 },
            { cLow: 155, cHigh: 254, aqiLow: 101, aqiHigh: 150 },
            { cLow: 255, cHigh: 354, aqiLow: 151, aqiHigh: 200 },
            { cLow: 355, cHigh: 424, aqiLow: 201, aqiHigh: 300 },
            { cLow: 425, cHigh: 604, aqiLow: 301, aqiHigh: 500 }
        ],
        no2: [
            { cLow: 0, cHigh: 53, aqiLow: 0, aqiHigh: 50 },
            { cLow: 54, cHigh: 100, aqiLow: 51, aqiHigh: 100 },
            { cLow: 101, cHigh: 360, aqiLow: 101, aqiHigh: 150 },
            { cLow: 361, cHigh: 649, aqiLow: 151, aqiHigh: 200 },
            { cLow: 650, cHigh: 1249, aqiLow: 201, aqiHigh: 300 },
            { cLow: 1250, cHigh: 2049, aqiLow: 301, aqiHigh: 500 }
        ],
        so2: [
            { cLow: 0, cHigh: 35, aqiLow: 0, aqiHigh: 50 },
            { cLow: 36, cHigh: 75, aqiLow: 51, aqiHigh: 100 },
            { cLow: 76, cHigh: 185, aqiLow: 101, aqiHigh: 150 },
            { cLow: 186, cHigh: 304, aqiLow: 151, aqiHigh: 200 },
            { cLow: 305, cHigh: 604, aqiLow: 201, aqiHigh: 300 },
            { cLow: 605, cHigh: 1004, aqiLow: 301, aqiHigh: 500 }
        ],
        o3: [
            { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
            { cLow: 55, cHigh: 70, aqiLow: 51, aqiHigh: 100 },
            { cLow: 71, cHigh: 85, aqiLow: 101, aqiHigh: 150 },
            { cLow: 86, cHigh: 105, aqiLow: 151, aqiHigh: 200 },
            { cLow: 106, cHigh: 200, aqiLow: 201, aqiHigh: 300 }
        ]
    };

    const pollutantBreakpoints = breakpoints[pollutant.toLowerCase()];
    if (!pollutantBreakpoints) return 0;

    // Find the appropriate breakpoint
    let breakpoint = null;
    for (const bp of pollutantBreakpoints) {
        if (concentration >= bp.cLow && concentration <= bp.cHigh) {
            breakpoint = bp;
            break;
        }
    }

    // If concentration exceeds highest breakpoint, use the last one
    if (!breakpoint && concentration > pollutantBreakpoints[pollutantBreakpoints.length - 1].cHigh) {
        breakpoint = pollutantBreakpoints[pollutantBreakpoints.length - 1];
    }

    if (!breakpoint) return 0;

    // Calculate AQI using linear interpolation
    const aqi = ((breakpoint.aqiHigh - breakpoint.aqiLow) / (breakpoint.cHigh - breakpoint.cLow)) * 
                (concentration - breakpoint.cLow) + breakpoint.aqiLow;

    return Math.round(aqi);
};

/**
 * Calculate overall AQI from station data
 * @param {Object} stationData - Station measurement data
 * @returns {Object} AQI information including value, level, and color
 */
export const calculateAQI = (stationData) => {
    if (!stationData) return { aqi: 0, level: 'N/A', color: '#ccc', description: 'No Record' };

    const pollutants = [
        { key: 'airPm25', name: 'pm25' },
        { key: 'airPm10', name: 'pm10' },
        { key: 'airNo2', name: 'no2' },
        { key: 'airSo2', name: 'so2' },
        { key: 'airO3', name: 'o3' }
    ];

    let maxAQI = 0;
    let dominantPollutant = '';

    // Calculate AQI for each pollutant and find the maximum
    pollutants.forEach(pollutant => {
        const concentration = parseFloat(stationData[pollutant.key]);
        if (concentration && concentration > 0) {
            const aqi = calculatePollutantAQI(concentration, pollutant.name);
            if (aqi > maxAQI) {
                maxAQI = aqi;
                dominantPollutant = pollutant.name.toUpperCase();
            }
        }
    });

    // Determine AQI level and color
    const getAQILevel = (aqi) => {
        if (aqi <= 50) return { level: 'Good', color: '#00e400', description: 'Air quality is good' };
        if (aqi <= 100) return { level: 'Moderate', color: '#ffff00', description: 'Air quality is acceptable' };
        if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#ff7e00', description: 'May affect sensitive groups' };
        if (aqi <= 200) return { level: 'Unhealthy', color: '#ff0000', description: 'Health effects for everyone' };
        if (aqi <= 300) return { level: 'Very Unhealthy', color: '#8f3f97', description: 'Serious health effects' };
        return { level: 'Hazardous', color: '#7e0023', description: 'Severe health effects' };
    };

    const aqiInfo = getAQILevel(maxAQI);

    return {
        aqi: maxAQI,
        level: aqiInfo.level,
        color: aqiInfo.color,
        description: aqiInfo.description,
        dominantPollutant
    };
};
