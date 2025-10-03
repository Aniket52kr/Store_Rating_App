// src/pages/Stores/StoreDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';
import apiClient from '../../services/apiClient';

export default function StoreDetail() {
  const { id } = useParams(); // store ID from URL
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [userRatingId, setUserRatingId] = useState(null); // Tracks actual rating ID
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch store & ratings
  useEffect(() => {
    const fetchStoreAndRatings = async () => {
      try {
        // Get store
        const storeRes = await apiClient.get(`/stores/${id}`);
        if (!storeRes.data) return navigate('/stores', { replace: true });
        setStore(storeRes.data);

        // Get all ratings
        const ratingsRes = await apiClient.get('/ratings'); // .data contains array
        const storeRatings = ratingsRes.data.filter((r) => r.store_id == id);

        // Calculate average
        const avg = storeRatings.length
          ? (storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length).toFixed(1)
          : 0;
        setAverageRating(avg);

        // Find current user's rating
        const myRating = storeRatings.find((r) => r.user_id === user.id);
        if (myRating) {
          setRating(myRating.rating);
          setUserRatingId(myRating.id); // Set real rating ID
        }
      } catch (err) {
        console.error("Failed to load store details", err);
        alert("Could not load store. Please try again.");
        navigate('/stores');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAndRatings();
  }, [id, user.id, navigate]);

  const handleSubmitRating = async () => {
    if (rating < 1 || rating > 5) {
      alert("Please select a valid rating between 1 and 5.");
      return;
    }

    try {
      if (userRatingId) {
        // Update existing rating
        await apiClient.put(`/ratings/${userRatingId}`, { rating });
        alert("Your rating has been updated!");
      } else {
        // Submit new rating
        await apiClient.post('/ratings', { store_id: id, rating });

        // Fix: Don't do array destructuring on axios response
        const ratingsRes = await apiClient.get('/ratings');
        const myNewRating = ratingsRes.data.find(
          (r) => r.user_id === user.id && r.store_id === parseInt(id)
        );

        if (myNewRating) {
          setUserRatingId(myNewRating.id); // Save real ID for future edits
        }

        alert("Thank you for your rating!");
      }
    } catch (err) {
      console.error("Rating submission failed:", err.response?.data || err.message);
      alert("Failed to submit rating. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading store details...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <p className="text-red-600">Store not found.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            ← Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
          <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
            ← Back to List
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <div className="space-y-5">
            <div>
              <strong>Name:</strong> <span className="text-gray-700">{store.name}</span>
            </div>
            <div>
              <strong>Address:</strong> <span className="text-gray-700">{store.address}</span>
            </div>
            <div>
              <strong>Email:</strong>{' '}
              <span className="text-gray-700">{store.email || 'Not available'}</span>
            </div>
            <div>
              <strong>Average Rating:</strong>{' '}
              <RatingStars rating={averageRating} readOnly size="medium" />
            </div>

            <hr className="border-gray-200" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userRatingId ? 'Modify Your Rating' : 'Submit Your Rating'}
              </label>
              <RatingStars
                rating={rating}
                onRate={setRating}
                size="large"
              />
              <div className="mt-4">
                <Button
                  variant={userRatingId ? "success" : "primary"}
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                >
                  {userRatingId ? 'Update Rating' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}