import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use(config => {
  const session = sessionStorage.getItem('lmsUser');
  if (session) {
    const { token } = JSON.parse(session);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
