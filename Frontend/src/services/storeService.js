// src/services/storeService.js
import apiClient from './apiClient';

// GET /stores - List all stores with average rating
export const getAllStores = async () => {
  return await apiClient.get('/stores');
};

// GET /stores/:id - Get single store details
export const getStoreById = async (id) => {
  return await apiClient.get(`/stores/${id}`);
};

// POST /stores - Create a new store (admin only)
export const createStore = async (storeData) => {
  return await apiClient.post('/stores', storeData);
};

// GET /stores/:id/ratings - Get all ratings for a specific store
// Used by store owners to see feedback
export const getStoreRatings = async (storeId) => {
  return await apiClient.get(`/stores/${storeId}/ratings`);
};