import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response, // Pass successful responses
  error => { // Error everything else
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export default api;