import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchEmissions = async () => {
    const response = await api.get('data/');
    return response.data;
};

export const fetchSummary = async () => {
    const response = await api.get('data/summary/');
    return response.data;
};

export const sendQuery = async (query) => {
    const response = await api.post('chat/', { query });
    return response.data;
};

export default api;
