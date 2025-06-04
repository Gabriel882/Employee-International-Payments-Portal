import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Useful if your backend uses cookies — keep or remove based on your setup
});

// Request interceptor — Attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('token');
        // Optionally notify the user before redirecting
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login'; // Consider using React Router's useNavigate for SPA
      }

      if (status === 500) {
        alert('An internal server error occurred. Please try again later.');
      }
    } else if (error.request) {
      alert('No response from server. Please check your internet connection.');
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
