import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:4000/api', // Update to your server URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically add Token to headers
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;