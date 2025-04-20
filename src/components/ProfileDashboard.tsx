import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Settings,
  Calendar,
  MessageSquare,
  FileText,
  Bell,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const ProfileDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const menuItems = [
    { icon: User, label: 'My Profile', description: 'View and edit your profile information' },
    { icon: Calendar, label: 'My Bookings', description: 'View your upcoming and past bookings' },
    { icon: MessageSquare, label: 'Messages', description: 'Check your messages and notifications' },
    { icon: FileText, label: 'Documents', description: 'Access your documents and files' },
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
    { icon: Settings, label: 'Settings', description: 'Adjust your account settings' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center space-x-4 pb-6 border-b dark:border-gray-700">
          <img
            src={user.profileImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Member since {user.joinDate}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Bookings</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12</p>
          </div>
          <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Messages</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5</p>
          </div>
          <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Documents</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">8</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileDashboard; 