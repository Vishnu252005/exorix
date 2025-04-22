import React, { useState, useEffect } from 'react';
import { X, ChevronDown, RefreshCw } from 'lucide-react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

// Game images mapping
const gameImages = {
  'League of Legends': 'https://cdn1.epicgames.com/salesEvent/salesEvent/EGS_LeagueofLegends_RiotGames_S1_2560x1440-ee500721c06da3ec1e5535a88588c77f',
  'VALORANT': 'https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-b88adde6a57e40aa85818820aa87a6cd',
  'Fortnite': 'https://cdn1.epicgames.com/offer/fn/23BR_C4S1_EGS_Launcher_Blade_2560x1440_2560x1440-437d0424d977f7bfa4c494f3248f4147',
  'CS:GO': 'https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_616x353.jpg',
  'Dota 2': 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota2_social.jpg',
  'Other': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
};

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface CreateEventModalProps {
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
    registrationsCount: number;
    createdAt: Date;
    registrationStatus: string;
    registrationDeadline: null;
    maxRegistrationsPerTeam: number;
    minTeamSize: number;
    maxTeamSize: number;
    registrationFields: {
      required: string[];
      optional: string[];
    };
  }) => void;
}

type DescriptionLength = 'short' | 'long';

const descriptionLengthConfig = {
  short: { words: "50-75", label: "Short" },
  long: { words: "200-250", label: "Long" }
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSubmit }) => {
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

  const [suggestions, setSuggestions] = useState({
    title: '',
    description: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState<DescriptionLength>('short');
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);

  const gameOptions = ['League of Legends', 'VALORANT', 'Fortnite', 'CS:GO', 'Dota 2', 'Other'];

  const generateSuggestions = async (game: string, length: DescriptionLength = descriptionLength) => {
    if (!game || game === 'Other') return;
    
    setIsGenerating(true);
    try {
      const prompt = `You are an expert esports tournament organizer. Based on the game "${game}", generate creative and professional suggestions for a tournament event title and description. The title should be catchy and appealing to gamers. For the description, generate a ${length} version (${descriptionLengthConfig[length].words} words) that highlights competitive aspects, prizes, and excitement.

Current title: ${formData.title || 'None'}
Current description: ${formData.description || 'None'}

Please provide suggestions in the following format:
Title: [Your title suggestion]
Description: [Your ${length} description suggestion]

Make the suggestions different from the current title/description if they exist.`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps create engaging esports tournament titles and descriptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.5,
          max_tokens: 1024,
          top_p: 1,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to generate suggestions:', errorText);
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      // Parse the response to extract title and description
      const titleMatch = content.match(/Title: (.*?)(?:\n|$)/);
      const descriptionMatch = content.match(/Description: ([\s\S]*?)(?:\n\n|$)/);

      const titleSuggestion = titleMatch ? titleMatch[1].trim() : '';
      const descriptionSuggestion = descriptionMatch ? descriptionMatch[1].trim() : '';

      if (titleSuggestion || descriptionSuggestion) {
        setSuggestions({
          title: titleSuggestion || '',
          description: descriptionSuggestion || ''
        });
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGameChange = async (game: string) => {
    console.log('Game changed to:', game);
    setFormData({
      ...formData,
      game,
      image: gameImages[game as keyof typeof gameImages] || gameImages['Other']
    });

    if (game !== 'Other') {
      console.log('Calling generateSuggestions for game:', game);
      await generateSuggestions(game);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
    if (formData.game && formData.game !== 'Other') {
      generateSuggestions(formData.game);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setFormData(prev => ({ ...prev, description: newDescription }));
    
    // Only generate new suggestions if we have a game selected and some text
    if (formData.game && formData.game !== 'Other' && newDescription.length > 2) {
      // Use a debounced version of generateSuggestions
      const timeoutId = setTimeout(() => {
        generateSuggestions(formData.game);
      }, 1000); // Wait for 1 second after typing stops
      
      // Cleanup timeout on next change
      return () => clearTimeout(timeoutId);
    }
  };

  const applySuggestion = (field: 'title' | 'description') => {
    setFormData({
      ...formData,
      [field]: suggestions[field]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the event data
      const eventData = {
        ...formData,
        date: new Date(formData.date),
        capacity: Number(formData.capacity),
        registrationsCount: 0,
        createdAt: new Date(),
        image: gameImages[formData.game as keyof typeof gameImages] || gameImages['Other'],
        registrationStatus: 'open',
        registrationDeadline: null,
        maxRegistrationsPerTeam: 1,
        minTeamSize: 1,
        maxTeamSize: 5,
        registrationFields: {
          required: ['playerName', 'email', 'gameId', 'phoneNumber', 'upiTransactionId'],
          optional: ['teamName', 'discordId']
        }
      };
      
      // Call onSubmit with the event data
      onSubmit(eventData);
    } catch (error) {
      console.error('Error preparing event data:', error);
      toast.error('Failed to prepare event data');
    }
  };

  const handleLengthChange = (length: DescriptionLength) => {
    setDescriptionLength(length);
    setShowLengthDropdown(false);
    if (formData.game) {
      generateSuggestions(formData.game, length);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            title="Close modal"
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
              <div className="mt-1 space-y-2">
                <div className="relative">
              <input
                type="text"
                id="title"
                value={formData.title}
                    onChange={handleTitleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                    placeholder="Enter event title"
                  />
                </div>

                {suggestions.title && !isGenerating && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 relative">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Suggested Title:
                            </p>
                            <button
                              type="button"
                              onClick={() => generateSuggestions(formData.game)}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              title="Generate new suggestion"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {suggestions.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applySuggestion('title')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:hover:bg-indigo-500 transition-colors"
                      >
                        Use This
                      </button>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating suggestions...</span>
                  </div>
                )}
              </div>
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
            <div className="mt-1 space-y-2">
              <div className="relative">
            <textarea
              id="description"
              value={formData.description}
                  onChange={handleDescriptionChange}
              rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
                  placeholder="Enter event description"
                />
              </div>

              {suggestions.description && !isGenerating && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 relative">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Suggested Description:
                          </p>
                          <button
                            type="button"
                            onClick={() => generateSuggestions(formData.game)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            title="Generate new suggestion"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="relative inline-flex items-center">
                          <button
                            type="button"
                            onClick={() => handleLengthChange(descriptionLength === 'short' ? 'long' : 'short')}
                            className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                          >
                            {descriptionLengthConfig[descriptionLength].label}
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {suggestions.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => applySuggestion('description')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:hover:bg-indigo-500 transition-colors"
                    >
                      Use This
                    </button>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating suggestions...</span>
                </div>
              )}
            </div>
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
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal; 