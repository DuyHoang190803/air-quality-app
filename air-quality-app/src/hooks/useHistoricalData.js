import { useState, useCallback } from 'react';
import { getHistoricalData } from '../api/api';

/**
 * Manages historical air quality data
 * @returns {Object} { historicalData, loading, error, fetchHistoricalData }
 */
export const useHistoricalData = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistoricalData = useCallback(async (stationId, dateRange, type = 'hourly') => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHistoricalData(
        stationId,
        dateRange.from.toISOString(),
        dateRange.to.toISOString(),
        type
      );
      setHistoricalData(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching historical data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { historicalData, loading, error, fetchHistoricalData };
};