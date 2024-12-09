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

// Fetch portfolio data by userId, walletAddress, providerUrl, and tokenAddresses
export const getPortfolio = async (userId, walletAddress, providerUrl, tokenAddresses) => 
  apiClient.get(`/workflow/portfolio/${userId}`, {
    params: { walletAddress, providerUrl, tokenAddresses },
  });

// Get portfolio value using the same parameters
export const getPortfolioValue = async (userId, walletAddress, providerUrl, tokenAddresses) => 
  apiClient.get(`/workflow/portfolio/${userId}/value`, {
    params: { walletAddress, providerUrl, tokenAddresses },
  });

export const getTopCryptos = async () => apiClient.get('/workflow/crypto/top10'); // All requests to the "workflow" endpoint

// User Authentication APIs
export const signup = async (data) => apiClient.post('/workflow/signup', data);
export const login = async (data) => apiClient.post('/workflow/login', data);
export const updatePassword = async (data) => apiClient.post('/workflow/password', data);

export default apiClient;
