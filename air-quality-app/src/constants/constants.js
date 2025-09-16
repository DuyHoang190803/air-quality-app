/**
 * API Endpoints for Air Quality service
 */
export const API_ENDPOINTS = {
  CURRENT_DATA: 'CityDashboard.Environment.Tile',
  STATIONS_LIST: 'CityDashboard.Environment.List',
  HISTORICAL_DATA: 'CityDashboard.Environment.History',
};

/**
 * View modes for the application
 */
export const VIEW_MODES = {
  MAP: 'map',
  TABLE: 'table',
};

/**
 * Air quality status levels
 */
export const AIR_QUALITY_LEVELS = {
  GOOD: 'good',
  MODERATE: 'moderate', 
  POOR: 'poor',
  VERY_POOR: 'very-poor',
  UNKNOWN: 'unknown',
};

/**
 * Map configuration
 */
export const MAP_CONFIG = {
  DEFAULT_CENTER: [15.8419, 50.2103], // Hradec Králové coordinates
  DEFAULT_ZOOM: 10,
  MIN_ZOOM: 8,
  MAX_ZOOM: 16,
};

/**
 * Data refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  CURRENT_DATA: 5 * 60 * 1000, // 5 minutes
  STATIONS_LIST: 30 * 60 * 1000, // 30 minutes
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error connecting to the network. Please try again.',
  API_ERROR: 'Error from server. Please try again later.',
  NO_DATA: 'No data available to display.',
  LOADING_ERROR: 'Error loading data.',
};