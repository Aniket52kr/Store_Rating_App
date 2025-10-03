// src/pages/StoresManagement/StoreCreate.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import apiClient from '../../services/apiClient';

export default function StoreCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]); // List of store_owner users
  const [fetchingOwners, setFetchingOwners] = useState(true);

  // Fetch all store owners on component mount
  useEffect(() => {
    const fetchStoreOwners = async () => {
      try {
        const res = await apiClient.get('/users');
        const storeOwners = res.data.filter(user => user.role === 'store_owner');
        setOwners(storeOwners);
      } catch (err) {
        console.error("Failed to load store owners", err);
        setErrors({ submit: "Could not load store owners. Admins only." });
      } finally {
        setFetchingOwners(false);
      }
    };

    fetchStoreOwners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === '' ? null : value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Store name must be at least 3 characters.';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }

    if (!formData.address || formData.address.length > 400) {
      newErrors.address = 'Address is required and cannot exceed 400 characters.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      // Send all data including owner_id (can be null)
      await apiClient.post('/stores', formData);
      alert('Store created successfully!');
      navigate('/dashboard/admin');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create store. Please try again.';
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2x font-bold text-gray-800">Add New Store</h1>
          <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
            ← Back
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <form onSubmit={handleSubmit}>
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                {errors.submit}
              </div>
            )}

            {/* Store Name */}
            <Input
              label="Store Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter store name"
              error={errors.name}
              required
            />

            {/* Email */}
            <Input
              label="Email (Optional)"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@store.com"
              error={errors.email}
            />

            {/* Address */}
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full physical address of the store"
                rows="4"
                className={`w-full px-3 py-2 border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            {/* Owner Dropdown */}
            <div className="mb-4">
              <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700 mb-1">
                Assign Store Owner 
              </label>
              {fetchingOwners ? (
                <p className="text-sm text-gray-500">Loading owners...</p>
              ) : (
                <select
                  id="owner_id"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No owner (or assign later)</option>
                  {owners.length === 0 ? (
                    <option disabled>No store owners available</option>
                  ) : (
                    owners.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))
                  )}
                </select>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only users with role "Store Owner" are listed.
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                variant="success"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Creating Store...' : 'Create Store'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}