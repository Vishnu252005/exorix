import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserProfile from './UserProfile';
import AdminProfile from './AdminProfile';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Loader } from 'lucide-react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: any;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        // If auth is still loading, wait
        if (authLoading) return;

        // If no user and auth is done loading, redirect to sign in
        if (!user) {
          navigate('/signin');
          return;
        }

        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!isMounted) return;

        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
          setError(null);
        } else {
          setError('User profile not found. Please sign in again.');
          await logout();
          navigate('/signin');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, navigate, logout]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  // Show loading spinner while authentication is checking
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show sign in prompt if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sign In Required</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please sign in to view your profile
            </p>
            <button
              onClick={() => navigate('/signin')}
              className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading spinner while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-red-600 dark:text-red-400 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Profile</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 border border-red-600 text-red-600 rounded-lg px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no user data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-yellow-600 dark:text-yellow-400 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We couldn't find your profile information. Please try signing in again.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 border border-red-600 text-red-600 rounded-lg px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render appropriate profile component based on user role
  return userData.isAdmin ? <AdminProfile /> : <UserProfile />;
};

export default Profile; 