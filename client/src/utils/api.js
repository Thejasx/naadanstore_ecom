import axios from 'axios';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        // Remove trailing slash if present, then ensure it ends with /api
        const cleanUrl = envUrl.replace(/\/$/, '');
        return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
    }
    // Default for local development
    return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname.includes('/admin')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
