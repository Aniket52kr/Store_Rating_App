// src/services/authService.js
import apiClient from './apiClient';

/**
 * Register a new user
 * Matches: POST /auth/register
 * Body: { name, email, password, address, role? }
 * Note: Frontend can send role, but should restrict non-admins from choosing 'admin'/'store_owner'
 */
export const register = async (userData) => {
  // Remove confirm fields before sending
  const { confirmPassword, ...dataToSend } = userData;
  return await apiClient.post('/auth/register', dataToSend);
};

/**
 * Login existing user
 * Matches: POST /auth/login
 * Body: { email, password }
 * Response: { token, role, user: { id, name, email, role } }
 */
export const login = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
};

/**
 * Update logged-in user's password
 * Matches: PUT /auth/update-password
 * Requires Auth Header
 * Body: { oldPassword, newPassword }
 */
export const updatePassword = async ({ oldPassword, newPassword }) => {
  return await apiClient.put('/auth/update-password', { oldPassword, newPassword });
};