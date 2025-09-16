import { useState, useEffect, useCallback } from 'react';
import { getCurrentMeasurements } from '../api/api';

/**
 * Manages current air quality data
 * @returns {Object} { currentData, loading, error, refetch }
 */
export const useCurrentData = () => {
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCurrentMeasurements();
      setCurrentData(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching current data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentData();

    // Auto refresh every 5 minutes
    const interval = setInterval(fetchCurrentData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchCurrentData]);

  return { currentData, loading, error, refetch: fetchCurrentData };
};