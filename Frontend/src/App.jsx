// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';
import StoreOwnerDashboard from './pages/Dashboard/StoreOwnerDashboard';

// Other Pages
import StoreList from './pages/Stores/StoreList';
import StoreDetail from './pages/Stores/StoreDetail';
import UserList from './pages/Users/UserList';
import UserDetail from './pages/Users/UserDetail';
import StoreCreate from './pages/StoresManagement/StoreCreate';
import UpdatePassword from './pages/Profile/UpdatePassword';
import StoreRatingsList from './pages/StoresManagement/StoreRatingsList';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Handled by AuthProvider
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Stores - Public */}
        <Route path="/stores" element={<StoreList />} />
        <Route path="/stores/:id" element={<StoreDetail />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Only */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stores/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StoreCreate />
            </ProtectedRoute>
          }
        />
        
        {/* View All Stores + Who Rated Them */}
        <Route
          path="/admin/stores-ratings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StoreRatingsList />
            </ProtectedRoute>
          }
        />

        {/* Store Owner Only */}
        <Route
          path="/dashboard/store-owner"
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/update-password"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to={user ? '/dashboard/user' : '/'} />} />
      </Routes>
    </div>
  );
}