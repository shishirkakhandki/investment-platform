import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3004',
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Workflow Service APIs
export const getPortfolio = async (userId) => apiClient.get(`/workflow/portfolio/${userId}`);
export const getPortfolioValue = async (userId) => apiClient.get(`/workflow/portfolio/${userId}/value`);
export const getTopCryptos = async () => apiClient.get('/workflow/crypto/top10');
export const signup = async (data) => apiClient.post('/workflow/signup', data);
export const login = async (data) => apiClient.post('/workflow/login', data);
export const updatePassword = async (data) => apiClient.post('/workflow/password', data);

export default apiClient;
