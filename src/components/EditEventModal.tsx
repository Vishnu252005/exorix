import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Timestamp, collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Game images mapping
const gameImages = {
  'League of Legends': 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_LeagueofLegends_RiotGames_S1_2560x1440-ee500721c06da3ec1e5535a88588c77f',
  'VALORANT': 'https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-b88adde6a57e40aa85818820aa87a6cd',
  'Fortnite': 'https://cdn1.epicgames.com/offer/fn/23BR_C4S1_EGS_Launcher_Blade_2560x1440_2560x1440-437d0424d977f7bfa4c494f3248f4147',
  'CS:GO': 'https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_616x353.jpg',
  'Dota 2': 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg',
  'Other': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
};

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: {
    title: string;
    description: string;
    date: Date;
    location: string;
    capacity: number;
    game: string;
    prize: string;
    registrationFee: string;
    image: string;
    status: 'Registration Open' | 'Coming Soon';
    organizerPhone: string;
    upiId: string;
    paymentInstructions: string;
  }) => void;
  eventData: {
    id: string;
    title: string;
    description: string;
    date: Timestamp;
    location: string;
    capacity: number;
    game: string;
    prize: string;
    registrationFee: string;
    image: string;
    status: 'Registration Open' | 'Coming Soon';
    organizerPhone?: string;
    upiId?: string;
    paymentInstructions?: string;
  } | null;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, onSubmit, eventData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 0,
    game: '',
    prize: '',
    registrationFee: '',
    status: 'Registration Open' as 'Registration Open' | 'Coming Soon',
    organizerPhone: '',
    upiId: '',
    paymentInstructions: '',
    image: ''
  });

  const gameOptions = ['League of Legends', 'VALORANT', 'Fortnite', 'CS:GO', 'Dota 2', 'Other'];

  const handleGameChange = (game: string) => {
    setFormData({
      ...formData,
      game,
      image: gameImages[game as keyof typeof gameImages] || gameImages['Other']
    });
  };

  useEffect(() => {
    if (eventData) {
      try {
        // Convert Firestore Timestamp to Date object, then to ISO string
        const date = eventData.date instanceof Timestamp 
          ? eventData.date.toDate() 
          : new Date(eventData.date);

        setFormData({
          title: eventData.title || '',
          description: eventData.description || '',
          date: date.toISOString().slice(0, 16),
          location: eventData.location || '',
          capacity: eventData.capacity || 0,
          game: eventData.game || '',
          prize: eventData.prize || '',
          registrationFee: eventData.registrationFee || '',
          status: eventData.status || 'Registration Open',
          organizerPhone: eventData.organizerPhone || '',
          upiId: eventData.upiId || '',
          paymentInstructions: eventData.paymentInstructions || '',
          image: eventData.image || ''
        });
      } catch (error) {
        console.error('Error setting form data:', error);
      }
    }
  }, [eventData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create event data with only the fields we have
      const updatedEventData = {
        ...formData,
        id: eventData?.id,
        date: new Date(formData.date),
        capacity: Number(formData.capacity),
        updatedAt: new Date(),
        image: gameImages[formData.game as keyof typeof gameImages] || gameImages['Other']
      };

      onSubmit(updatedEventData);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="game" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Game
              </label>
              <select
                id="game"
                value={formData.game}
                onChange={(e) => handleGameChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Select a game</option>
                {gameOptions.map((game) => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.game && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Image Preview
              </label>
              <img
                src={gameImages[formData.game as keyof typeof gameImages] || gameImages['Other']}
                alt={`${formData.game} preview`}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Date
              </label>
              <input
                type="datetime-local"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="prize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Prize Pool
              </label>
              <input
                type="text"
                id="prize"
                value={formData.prize}
                onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                placeholder="e.g. $1,000"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="registrationFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Registration Fee
              </label>
              <input
                type="text"
                id="registrationFee"
                value={formData.registrationFee}
                onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                placeholder="e.g. ₹50 per team"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Team Capacity
              </label>
              <input
                type="number"
                id="capacity"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Payment Information Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="organizerPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Organizer Phone Number
                </label>
                <input
                  type="tel"
                  id="organizerPhone"
                  value={formData.organizerPhone}
                  onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                  placeholder="e.g. +91 9876543210"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  UPI ID
                </label>
                <input
                  type="text"
                  id="upiId"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="e.g. yourname@upi"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="paymentInstructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Instructions
              </label>
              <textarea
                id="paymentInstructions"
                value={formData.paymentInstructions}
                onChange={(e) => setFormData({ ...formData, paymentInstructions: e.target.value })}
                placeholder="Provide instructions for payment (e.g. 'Please mention your team name in the payment description')"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Event Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Registration Open' | 'Coming Soon' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="Registration Open">Registration Open</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal; 