import React, { createContext, useContext, useState, useMemo } from 'react';
import { useStations } from '../hooks/useStations';
import { useCurrentData } from '../hooks/useCurrentData';
import { VIEW_MODES } from '../constants/constants';

/**
 * App Context - Manages global state
 */
const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.MAP);
  const [selectedStation, setSelectedStation] = useState(null);

  const { stations, loading: stationsLoading, error: stationsError } = useStations();
  const { currentData, loading: currentLoading, error: currentError } = useCurrentData();

  const loading = stationsLoading || currentLoading;
  const error = stationsError || currentError;

  // Combine stations with current measurements
  const stationsWithCurrentData = useMemo(() => {
    // Make sure both stations and currentData are arrays
    const validStations = Array.isArray(stations) ? stations : [];
    // const validCurrentData = Array.isArray(currentData) ? currentData : [];

    // Use stations data directly as it is the actual data from API with correct structure
    return validStations.length > 0 ? validStations : [];
  }, [stations]);

  const value = {
    // Data
    stations: stationsWithCurrentData,
    loading,
    error,

    // UI State
    viewMode,
    setViewMode,
    selectedStation,
    setSelectedStation,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};