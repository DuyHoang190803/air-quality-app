import axios from 'axios';

/**
 * Axios instance with authentication for Air Quality API
 */
const authorizedApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to header
authorizedApi.interceptors.request.use(
  (config) => {
    const token = import.meta.env.VITE_API_TOKEN;
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor - Handle common errors
authorizedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('API Authentication failed');
    }
    return Promise.reject(error);
  }
);


export { authorizedApi };