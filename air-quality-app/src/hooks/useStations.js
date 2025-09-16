import { useState, useEffect, useCallback } from 'react';
import { getStationsList } from '../api/api';
import { processStationData } from '../utils/helpers';

/**
 * Manages air quality stations data
 * @returns {Object} { stations, loading, error, refetch }
 */
export const useStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStationsList();
      const processedData = processStationData(response.data || []);
      setStations(processedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return { stations, loading, error, refetch: fetchStations };
};