// src/pages/Dashboard/UserDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [userRatingIds, setUserRatingIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storesRes = await apiClient.get('/stores');
        const ratingsRes = await apiClient.get('/ratings');

        setStores(storesRes.data);
        setFilteredStores(storesRes.data); // Initialize filtered list

        const myRatings = {};
        const myRatingIds = {};

        ratingsRes.data.forEach(r => {
          if (r.user_id === user.id) {
            myRatings[r.store_id] = r.rating;
            myRatingIds[r.store_id] = r.id;
          }
        });

        setUserRatings(myRatings);
        setUserRatingIds(myRatingIds);
      } catch (err) {
        console.error("Failed to load data", err);
        alert("Could not load stores or ratings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Apply search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredStores(
        stores.filter(store =>
          store.name.toLowerCase().includes(lower) ||
          store.address.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, stores]);

  const handleRate = async (storeId, rating) => {
    if (rating < 1 || rating > 5) {
      alert("Please select a valid rating between 1 and 5.");
      return;
    }

    try {
      if (userRatingIds[storeId]) {
        await apiClient.put(`/ratings/${userRatingIds[storeId]}`, { rating });
      } else {
        await apiClient.post('/ratings', { store_id: storeId, rating });
      }

      setUserRatings({ ...userRatings, [storeId]: rating });
      alert(`Thank you for rating ${rating} star${rating > 1 ? 's' : ''}!`);
    } catch (err) {
      console.error("Rating submission failed:", err.response?.data || err.message);
      alert("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Rate the stores you've visited, {user?.name?.split(' ')[0]} 👋
              </p>
            </div>

            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              size="sm"
              className="self-start sm:self-center shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Stores
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear search
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">
          Available Stores
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-xl text-gray-600 font-medium">Discovering stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <Card className="text-center p-8">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700">
              No stores match <strong>"{searchTerm}"</strong>
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="mt-3"
            >
              Clear Search
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card
                key={store.id}
                className="bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500"
              >
                <div className="space-y-3">
                  <h3
                    onClick={() => navigate(`/stores/${store.id}`)}
                    className="text-xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{store.address}</p>

                  {/* Average Rating */}
                  <div className="mt-2">
                    <strong className="text-gray-700">Average:</strong>{' '}
                    <RatingStars
                      rating={parseFloat(store.overall_rating).toFixed(1)}
                      readOnly
                      size="small"
                    />
                  </div>

                  {/* Your Rating */}
                  <div className="mt-3">
                    <strong className="text-gray-700">Your Rating:</strong>{' '}
                    {userRatings[store.id] ? (
                      <RatingStars rating={userRatings[store.id]} readOnly size="small" />
                    ) : (
                      <span className="text-gray-400 italic text-sm">Not rated yet</span>
                    )}
                  </div>

                  {/* Interactive Stars */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <RatingStars
                      rating={userRatings[store.id] || 0}
                      onRate={(rating) => handleRate(store.id, rating)}
                      size="small"
                      className="scale-100 hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}