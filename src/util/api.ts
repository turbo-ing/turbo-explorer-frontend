import axios from 'axios';

// Create an Axios instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const api = (fetchOptions?: Record<string, any>) => axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  fetchOptions: {
    cache: 'no-store',
    ...fetchOptions},
});

api().interceptors.response.use(
  response => {
    console.log('API Request URL:', response.config.url);
    return response; // Pass successful responses
  },
  error => { // Error everything else
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export default api;