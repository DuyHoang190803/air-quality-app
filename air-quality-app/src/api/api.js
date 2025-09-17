import { authorizedApi } from './baseApi/authorizedApi';
import { API_ENDPOINTS } from '../constants/constants';

const API_BASE_URL = "/query";

/**
 * Get list of all air quality stations
 * @returns {Promise<Array>} Stations list data
 */
export const getStationsList = () => {
  return authorizedApi.post(`${API_BASE_URL}?name=${API_ENDPOINTS.STATIONS_LIST}`);
};

/**
 * Get historical data for a specific station
 * @param {string} itemId - Station ID
 * @param {string} from - Start date (ISO string)
 * @param {string} to - End date (ISO string)
 * @param {string} type - Data type ('hourly' | 'daily')
 * @returns {Promise<Array>} Historical data
 */
export const getHistoricalData = (itemId, from, to, type = 'hourly') => {
  const body = {
    itemId,
    from,
    to,
    type,
  };

  return authorizedApi.post(`${API_BASE_URL}?name=${API_ENDPOINTS.HISTORICAL_DATA}`, body);
};


// Export all functions as an object for easier import
export const airQualityAPI = {
  getStationsList,
  getHistoricalData,
};


export default airQualityAPI;
