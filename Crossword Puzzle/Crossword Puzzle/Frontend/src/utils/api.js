import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 🔑 Logging and token attachment
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    console.log('🏷️ [Request] Token:', token);
    console.log('🏷️ [Request] URL:', `${config.baseURL}${config.url}`);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Cookies.remove('token');
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/admin/register', data),
  login: (data) => api.post('/admin/login', data),
  logout: () => api.get('/admin/logout'),
  getProfile: () => api.get('/admin/profile'),
};

export const dictionaryAPI = {
  create: (data) => api.post('/crossword/custom/create', data),
  update: (id, data) => api.post(`/crossword/custom/update/${id}`, data),
  delete: (id) => api.post(`/crossword/custom/delete/${id}`),
  get: (id) => api.post(`/crossword/custom/get/${id}`),
  getAll: () => api.get('/crossword/custom/getAll'),
};

export const crosswordAPI = {
  generateDefault: (dictId) => api.post(`/crossword/${dictId}`),
  generateWithSize: (dictId, size) => api.post(`/crossword/size/${dictId}`, { size }),
  regenerate: (dictId, size) => api.post(`/crossword/generate/${dictId}`, { size }),
  submit: (dictId, score) => api.post(`/crossword/submit/${dictId}`, { score }),
  getLeaderboard: (dictId) => api.post(`/crossword/custom/leaderboard/${dictId}`),
};

export default api;
