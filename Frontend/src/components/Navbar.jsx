// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToDashboard = () => {
    if (!user) return;
    switch (user.role) {
      case 'admin':
        navigate('/dashboard/admin');
        break;
      case 'store_owner':
        navigate('/dashboard/store-owner');
        break;
      default:
        navigate('/dashboard/user');
    }
  };

  return (
    <nav 
      className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 w-full z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1
              onClick={() => navigate('/')}
              className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            >
              StoreRater
            </h1>
          </div>

          {/* Right Side: Greeting + Dashboard + Logout */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <>
                {/* Greeting */}
                <span className="text-sm text-gray-700 hidden sm:inline">
                  Hello, <strong>{user.name?.split(' ')[0]}</strong>
                </span>

                {/* Dashboard Button */}
                <button
                  onClick={goToDashboard}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 hover:shadow"
                >
                  Dashboard
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition duration-150 ease-in-out hover:shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Login Button for Guests */
              <button
                onClick={() => navigate('/login')}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md shadow-sm transition duration-150 ease-in-out hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}