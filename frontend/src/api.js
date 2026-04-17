import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(config => {
  const session = sessionStorage.getItem('lmsUser');
  if (session) {
    const { token } = JSON.parse(session);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
