// src/pages/Stores/StoreList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';
import apiClient from '../../services/apiClient';

export default function StoreList() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [userRatings, setUserRatings] = useState({}); // store_id → rating
  const [userRatingIds, setUserRatingIds] = useState({}); // store_id → rating.id
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, ratingsRes] = await Promise.all([
          apiClient.get('/stores'),
          apiClient.get('/ratings'),
        ]);

        const storeData = storesRes.data;
        setStores(storeData);
        setFilteredStores(storeData);

        // Map: user's rating value + rating record ID
        const myRatings = {};
        const myRatingIds = {};
        ratingsRes.data.forEach((r) => {
          if (r.user_id === user.id) {
            myRatings[r.store_id] = r.rating;
            myRatingIds[r.store_id] = r.id; // Save the rating's ID
          }
        });

        setUserRatings(myRatings);
        setUserRatingIds(myRatingIds);
      } catch (err) {
        console.error("Failed to load data", err);
        alert("Could not load stores. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredStores(
        stores.filter(
          (store) =>
            store.name.toLowerCase().includes(lower) ||
            store.address.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, stores]);

  const handleRate = async (storeId, rating) => {
    try {
      if (userRatingIds[storeId]) {
        // Update existing rating using actual rating ID
        await apiClient.put(`/ratings/${userRatingIds[storeId]}`, { rating });
      } else {
        // Submit new rating
        await apiClient.post('/ratings', { store_id: storeId, rating });
      }

      // Update local state
      setUserRatings({ ...userRatings, [storeId]: rating });
      if (!userRatingIds[storeId]) {
        // If new, we can't know the ID until reload, but backend handles upsert anyway
      }

      alert(`Thank you for your ${rating}-star rating!`);
    } catch (err) {
      alert("Failed to submit rating. Please try again.", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-800">All Stores</h1>
          <p className="text-gray-600">Rate the stores you've visited.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-lg text-gray-600">Loading stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <Card>
            <p className="text-gray-500">No stores match your search.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id}>
                <div className="space-y-3">
                  <h3
                    onClick={() => navigate(`/stores/${store.id}`)}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition"
                  >
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-600">{store.address}</p>

                  <div>
                    <strong>Average:</strong>{' '}
                    <RatingStars
                      rating={parseFloat(store.overall_rating).toFixed(1)}
                      readOnly
                      size="small"
                    />
                  </div>

                  <div>
                    <strong>Your Rating:</strong>{' '}
                    {userRatings[store.id] ? (
                      <RatingStars rating={userRatings[store.id]} readOnly size="small" />
                    ) : (
                      <span className="text-gray-500 text-sm">Not rated yet</span>
                    )}
                  </div>

                  <div className="mt-2">
                    <RatingStars
                      rating={userRatings[store.id] || 0}
                      onRate={(rating) => handleRate(store.id, rating)}
                      size="small"
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