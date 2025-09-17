import React, { createContext, useContext, useState } from 'react';
import { useStations } from '../hooks/useStations';
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

  const loading = stationsLoading;
  const error = stationsError;

  const value = {
    // Data
    stations,
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