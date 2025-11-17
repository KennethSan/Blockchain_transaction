import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const transactionAPI = {
  create: (data) => api.post('/transaction', data),
  getPending: () => api.get('/transactions/pending'),
  getAll: () => api.get('/transactions'),
};

export const blockchainAPI = {
  mine: () => api.post('/block/mine'),
  getBlocks: () => api.get('/blocks'),
  validate: () => api.get('/blockchain/validate'),
  getStatistics: () => api.get('/blockchain/statistics'),
};

export default api;
