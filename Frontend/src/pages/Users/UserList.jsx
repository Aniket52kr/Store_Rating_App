// src/pages/Users/UserList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import apiClient from '../../services/apiClient';

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get('/users');
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
        alert("You may not have permission to view users.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Apply filters
  useEffect(() => {
    let result = [...users];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          (u.address && u.address.toLowerCase().includes(lower))
      );
    }

    if (filterRole) {
      result = result.filter((u) => u.role === filterRole);
    }

    setFilteredUsers(result);
  }, [searchTerm, filterRole, users]);

  // Role badge colors
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'store_owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Title Section */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
              <p className="text-gray-600 mt-1">View and manage all platform users.</p>
            </div>

            {/* Back Button - Now Correctly Positioned */}
            <div className="self-start">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/dashboard/admin')}
                className="shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Controls */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <input
              type="text"
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>

            <Button
              onClick={() => navigate('/users/create')}
              variant="success"
              size="sm"
            >
              + Add New User
            </Button>
          </div>
        </Card>

        {/* User Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <p className="text-lg text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <p className="text-gray-500">No users match your criteria.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Address</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 text-gray-800">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.address ? `${user.address.substring(0, 50)}...` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex text-xs font-medium px-2.5 py-0.5 rounded border ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role === 'user' ? 'Normal User' :
                         user.role === 'store_owner' ? 'Store Owner' :
                         'System Admin'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}