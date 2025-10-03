// src/services/userService.js
import apiClient from './apiClient';

// GET /users - List all users
export const getAllUsers = async () => {
  return await apiClient.get('/users');
};

// GET /users/:id - Get one user by ID
export const getUserById = async (id) => {
  return await apiClient.get(`/users/${id}`);
};

// POST /users - Create new user (admin only)
export const createUser = async (userData) => {
  return await apiClient.post('/users', userData);
};