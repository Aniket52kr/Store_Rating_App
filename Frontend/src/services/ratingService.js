// src/services/ratingService.js
import apiClient from './apiClient';

// POST /ratings - Submit a new rating
// If user already rated, backend can handle upsert via ON DUPLICATE KEY UPDATE
export const addRating = async (ratingData) => {
  return await apiClient.post('/ratings', ratingData);
};

// PUT /ratings/:id - Update an existing rating by its ID
// Ensure user owns the rating (checked in backend)
export const updateRating = async (ratingId, updatedRating) => {
  return await apiClient.put(`/ratings/${ratingId}`, updatedRating);
};

// Optional: Fetch user's own rating for a store (can be derived from other calls too)
export const getUserRatings = async () => {
  return await apiClient.get('/ratings');
};