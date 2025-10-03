// src/pages/Users/UserDetail.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import apiClient from '../../services/apiClient';

export default function UserDetail() {
  const { id } = useParams(); // user ID from URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user", err);
        alert("Could not load user details.");
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <p className="text-red-600">User not found.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            ← Back
          </Button>
        </Card>
      </div>
    );
  }

  const getRoleColor = () => {
    switch (user.role) {
      case 'admin': return 'text-red-700 bg-red-50 border-red-200';
      case 'store_owner': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'user': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">User Details</h1>
          <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
            ← Back
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <div className="space-y-6">
            <div>
              <strong className="text-gray-700">Full Name:</strong>
              <p className="mt-1 text-gray-800 text-lg">{user.name}</p>
            </div>

            <div>
              <strong className="text-gray-700">Email Address:</strong>
              <p className="mt-1 text-blue-600">{user.email}</p>
            </div>

            <div>
              <strong className="text-gray-700">Address:</strong>
              <p className="mt-1 text-gray-800 whitespace-pre-line">
                {user.address || <em className="text-gray-500">Not provided</em>}
              </p>
            </div>

            <div>
              <strong className="text-gray-700">Role:</strong>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor()}`}
                >
                  {user.role === 'user' ? 'Normal User' :
                   user.role === 'store_owner' ? 'Store Owner' :
                   'System Administrator'}
                </span>
              </div>
            </div>

            {/* Store Rating (if store owner) */}
            {user.role === 'store_owner' && (
              <div>
                <strong className="text-gray-700">Store Performance:</strong>
                <p className="mt-1 text-gray-800">
                  This user is a store owner. You can view their store ratings from the store dashboard.
                </p>
              </div>
            )}

            <hr className="border-gray-200" />

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                onClick={() => navigate('/users')}
                variant="outline"
              >
                ← All Users
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}