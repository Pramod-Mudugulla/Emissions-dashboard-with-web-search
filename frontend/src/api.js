import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
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
