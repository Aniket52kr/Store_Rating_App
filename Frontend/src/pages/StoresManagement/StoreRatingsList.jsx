// src/pages/StoresManagement/StoreRatingsList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import RatingStars from '../../components/RatingStars';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

export default function StoreRatingsList() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [users, setUsers] = useState({}); // Map: id → { name, email }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch stores, ratings, and all users
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/', { replace: true });
            return;
        }

        const fetchData = async () => {
            try {
                const [storesRes, ratingsRes, usersRes] = await Promise.all([
                    apiClient.get('/stores'),
                    apiClient.get('/ratings'),
                    apiClient.get('/users'), // Needed to get owner names
                ]);

                setStores(storesRes.data);

                // Convert users to map for fast lookup
                const userMap = {};
                usersRes.data.forEach(u => {
                    userMap[u.id] = { name: u.name, email: u.email };
                });
                setUsers(userMap);

                setRatings(ratingsRes.data);
            } catch (err) {
                console.error('Failed to load data:', err);
                setError(
                    err.response?.data?.message || 'Could not load stores, ratings, or users.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    // Group ratings by store_id
    const getRatingsByStore = (storeId) => {
        return ratings.filter(r => r.store_id === storeId);
    };

    // Calculate average rating
    const getAverageRating = (storeId) => {
        const storeRatings = getRatingsByStore(storeId);
        if (storeRatings.length === 0) return '0.0';
        const avg = storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length;
        return avg.toFixed(1);
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-lg border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">Manage Stores & Ratings</h1>
                            <p className="text-lg text-gray-600 mt-1">
                                View all stores, owners, and customer feedback.
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/dashboard/admin')}
                            className="self-start sm:self-center shadow-md hover:shadow-lg transition-shadow"
                        >
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                            <p className="mt-4 text-xl text-gray-600">Loading stores, owners, and ratings...</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {stores.length === 0 ? (
                            
                                <Card>
                                    <p className="text-gray-500 text-center py-4">No stores registered yet.</p>
                                </Card>
                            ) : (
                                stores.map((store) => {
                                    const storeRatings = getRatingsByStore(store.id);
                                    const avgRating  = getAverageRating(store.id);
                                    const owner = store.owner_id ? users[store.owner_id] : null;

                                    return (
                                        <Card key={store.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                            <div className="border-b border-gray-200 pb-4 mb-4">
                                                <h2 className="text-2xl font-bold text-gray-800">{store.name}</h2>
                                                <p className="text-gray-600 mt-1">
                                                    <strong>Email:</strong>{' '}
                                                    {store.email ? (
                                                        <span>{store.email}</span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not available</span>
                                                    )
                                                    }
                                                </p>
                                            
                                                <p className="text-gray-600"><strong>Address:</strong> {store.address}</p>

                                                {/* 👤 Store Owner Info */}
                                                <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                                                    <strong>Store Owner:</strong>{' '}
                                                    {owner ? (
                                                        <>
                                                            <span className="font-medium">{owner.name}</span>{' '}
                                                            <span className="text-gray-700">({owner.email})</span>
                                                        </>
                                                    ) : (
                                                            <span className="text-gray-500 italic">No owner assigned</span>
                                                        )
                                                    }
                                                </div>

                                                {/* Average Rating */}
                                                <div className="mt-2">
                                                    <strong>Average Rating:</strong>{' '}
                                                    <RatingStars rating={avgRating} readOnly size="small" />
                                                    <span className="ml-2 text-gray-700">({storeRatings.length} rating{storeRatings.length !== 1 ? 's' : ''})</span>
                                                </div>
                                            </div>

                                            {/* 📊 Customer Ratings Table */}
                                            {storeRatings.length === 0 ? (
                                                <p className="text-gray-500 italic">No ratings submitted yet for this store.</p>
                                            ) : (
                                                    <div className="overflow-x-auto">
                                                        <table className="min-w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
                                                                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                                                                <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
                                                            </tr>
                                                        </thead>
                                                          
                                                        <tbody>
                                                            {storeRatings.map((r, idx) => (
                                                                <tr key={idx} className="hover:bg-gray-50">
                                                                    <td className="border border-gray-300 px-4 py-2 font-medium">{r.user_name}</td>
                                                                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{r.user_email}</td>
                                                                    <td className="border border-gray-300 px-4 py-2">
                                                                    <RatingStars rating={r.rating} readOnly size="small" />
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    )}
                </main>
            </div>
        );
}