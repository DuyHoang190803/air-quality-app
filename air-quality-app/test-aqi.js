import { calculatePollutantAQI, calculateAQI } from './src/utils/helpers.js';

console.log('=== Testing O3 Edge Cases ===');

// Test O3 edge cases that were failing
const o3TestCases = [
    54.3,   // Was returning 0
    54.5,   // Edge of first range
    70.7,   // Was returning 0  
    70.5,   // Edge between ranges
    72.3,   // Should work
    85.6,   // Was returning 0
    85.1,   // Edge of range
    86.0,   // Start of next range
    65,     // Middle value
    50,     // Good range
    55,     // Start of moderate
    71,     // Start of unhealthy for sensitive
    86,     // Start of unhealthy
    106,    // Start of very unhealthy
    200,    // Max of very unhealthy
    250     // Beyond max (should cap)
];

o3TestCases.forEach(value => {
    const aqi = calculatePollutantAQI(value, 'o3');
    const stationResult = calculateAQI({ airO3: value });
    console.log(`O3=${value}: AQI=${aqi}, Station AQI=${stationResult.aqi}, Color=${stationResult.color}`);
});

console.log('\n=== Testing PM2.5 Edge Cases ===');
const pm25TestCases = [12.0, 12.1, 35.4, 35.5, 55.4, 55.5];

pm25TestCases.forEach(value => {
    const aqi = calculatePollutantAQI(value, 'pm25');
    const stationResult = calculateAQI({ airPm25: value });
    console.log(`PM2.5=${value}: AQI=${aqi}, Station AQI=${stationResult.aqi}, Color=${stationResult.color}`);
});