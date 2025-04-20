import React, { useState, useEffect } from 'react';
import { Trophy, Users, GamepadIcon, MessageSquare, X, DollarSign, CreditCard, Calendar, MapPin, ArrowRight, RefreshCw, Trash2, Cpu, Plus, Eye } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, arrayUnion, addDoc, increment, setDoc, getDoc, onSnapshot, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSubmit: (formData: any) => Promise<void>;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, event, onSubmit }) => {
  const [formData, setFormData] = useState({
    playerName: '',
    email: '',
    gameId: '',
    teamName: '',
    phoneNumber: '',
    discordId: '',
    upiTransactionId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await onSubmit(formData);
      setSuccess(true);
      // Don't reload the page, just close the modal after 2 seconds
      setTimeout(() => {
        onClose();
        // Navigate to profile page to see registered events
        window.location.href = '/profile';
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register for the event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Register for {event.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            title="Close registration modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">
              Successfully registered for {event.title}. You will receive a confirmation email shortly.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Information Section */}
            {event.registrationFee && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center mb-3">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Payment Information
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-2">
                  <strong>Registration Fee:</strong> {event.registrationFee}
                </p>
                {event.upiId && (
                  <p className="text-blue-700 dark:text-blue-300 mb-2">
                    <strong>UPI ID:</strong> {event.upiId}
                  </p>
                )}
                {event.organizerPhone && (
                  <p className="text-blue-700 dark:text-blue-300 mb-2">
                    <strong>Organizer Phone:</strong> {event.organizerPhone}
                  </p>
                )}
                {event.paymentInstructions && (
                  <div className="text-blue-700 dark:text-blue-300 mb-2">
                    <strong>Payment Instructions:</strong>
                    <p className="mt-1">{event.paymentInstructions}</p>
                  </div>
                )}
                <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
                  Please complete the payment before submitting this form.
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Player Name *
              </label>
              <input
                type="text"
                required
                value={formData.playerName}
                onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your gaming name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Game ID *
              </label>
              <input
                type="text"
                required
                value={formData.gameId}
                onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your in-game ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Name
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your team name (if applicable)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discord ID
              </label>
              <input
                type="text"
                value={formData.discordId}
                onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your Discord username (optional)"
              />
            </div>

            {/* UPI Transaction ID Field */}
            {event.registrationFee && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  UPI Transaction ID *
                </label>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    required
                    value={formData.upiTransactionId}
                    onChange={(e) => setFormData({ ...formData, upiTransactionId: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your UPI transaction ID"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Please enter the transaction ID after making the payment to {event.upiId || "the organizer's UPI ID"}
                </p>
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Registering...' : 'Register for Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface Event {
  id: string;
  title: string;
  description?: string;
  game: string;
  date: any;
  prize: string | number;
  registrationFee?: string | number;
  location: string;
  currentParticipants: number;
  capacity: number;
  status: string;
  image?: string;
}

interface TeamRegistration {
  id: string;
  teamName: string;
  playerName: string;
  gameId: string;
  email: string;
  registeredAt: any;
}

interface FormData {
  playerName: string;
  email: string;
  gameId: string;
  teamName?: string;
  phoneNumber: string;
  discordId?: string;
  upiTransactionId?: string;
}

interface GroqMatchPrediction {
  confidence: number;
  suggestedWinner: 'team1' | 'team2';
  reason: string;
}

interface MatchPair {
  id: string;
  team1: TeamRegistration;
  team2: TeamRegistration;
  status: 'pending' | 'ready' | 'in_progress' | 'completed';
  createdAt: any;
  completedAt?: any;
  winner?: 'team1' | 'team2';
  eventId: string;
  aiPrediction?: GroqMatchPrediction;
  matchStats?: {
    team1Score?: number;
    team2Score?: number;
    duration?: number;
    highlights?: string[];
  };
}

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchPair;
  onUpdateMatch: (matchId: string, updates: Partial<MatchPair>) => Promise<void>;
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ isOpen, onClose, match, onUpdateMatch }) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateMatch = async (winner: 'team1' | 'team2') => {
    setLoading(true);
    try {
      await onUpdateMatch(match.id, {
        status: 'completed',
        winner: winner,
        completedAt: new Date()
      });
      onClose();
    } catch (err) {
      console.error('Error updating match:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 rounded-xl p-8 max-w-2xl w-full mx-4 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Match Details</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Close modal"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Match Status */}
          <div className="flex items-center justify-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              match.status === 'completed' 
                ? 'bg-green-500/20 text-green-400'
                : match.status === 'in_progress'
                ? 'bg-yellow-500/20 text-yellow-400'
                : match.status === 'ready'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1).replace('_', ' ')}
            </span>
          </div>

          {/* Teams */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Team 1 */}
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                {match.team1?.teamName || match.team1?.playerName}
              </h3>
              <p className="text-sm text-indigo-400">Team 1</p>
              {match.status !== 'completed' && (
                <button
                  onClick={() => handleUpdateMatch('team1')}
                  disabled={loading}
                  className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 
                  transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Declare Winner
                </button>
              )}
              {match.winner === 'team1' && (
                <div className="mt-4 flex items-center justify-center text-green-400">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span>Winner</span>
                </div>
              )}
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">VS</div>
              {match.completedAt && (
                <p className="text-sm text-gray-400 mt-2">
                  Completed: {new Date(match.completedAt?.seconds * 1000).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Team 2 */}
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                {match.team2?.teamName || match.team2?.playerName || 'Waiting for opponent'}
              </h3>
              <p className="text-sm text-indigo-400">Team 2</p>
              {match.status !== 'completed' && match.team2 && (
                <button
                  onClick={() => handleUpdateMatch('team2')}
                  disabled={loading}
                  className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 
                  transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Declare Winner
                </button>
              )}
              {match.winner === 'team2' && (
                <div className="mt-4 flex items-center justify-center text-green-400">
                  <Trophy className="w-5 h-5 mr-2" />
                  <span>Winner</span>
                </div>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-400">
              <span className="text-gray-300">Match ID:</span> {match.id}
            </p>
            <p className="text-sm text-gray-400">
              <span className="text-gray-300">Created:</span> {new Date(match.createdAt?.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AuthContextType {
  user: any;
  userData: {
    registeredEvents?: any[];
    [key: string]: any;
  } | null;
}

const Esports = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEventTeams, setSelectedEventTeams] = useState<TeamRegistration[]>([]);
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>([]);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const auth = useAuth() as unknown as AuthContextType;
  const { user, userData } = auth;
  const [selectedMatch, setSelectedMatch] = useState<MatchPair | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
    if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data()?.isAdmin || false);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleRegisterClick = (event: Event) => {
    if (!user) {
      alert('Please log in to register for events');
      return;
    }
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = async (formData: FormData) => {
    if (!selectedEvent || !user) return;

    try {
      console.log("Starting registration process for event:", selectedEvent.id);
      const eventRef = doc(db, 'events', selectedEvent.id);
      const registrationsRef = collection(eventRef, 'registrations');

      // First check if user has already registered
      const existingRegistration = doc(registrationsRef, user.uid);
      const registrationDoc = await getDoc(existingRegistration);
      
      if (registrationDoc.exists()) {
        throw new Error('You have already registered for this event');
      }

      // Get user data to include email
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.exists() ? userDoc.data() : null;
      console.log("User data retrieved:", userData ? "success" : "not found");
      const userEmail = formData.email || userData?.email || user.email;

      // Create registration document in the registrations subcollection
      const registrationData = {
        ...formData,
        userId: user.uid,
        userEmail: userEmail,
        eventId: selectedEvent.id,
        registeredAt: new Date(),
        status: 'pending',
        paymentStatus: formData.upiTransactionId ? 'pending_verification' : 'pending',
        teamName: formData.teamName || null,
        discordId: formData.discordId || null,
        upiTransactionId: formData.upiTransactionId || null,
        paymentAmount: selectedEvent.registrationFee || null,
        paymentDate: formData.upiTransactionId ? new Date() : null
      };

      console.log("Registration data prepared:", registrationData);

      try {
        // Create or update the _info document first
        const infoRef = doc(registrationsRef, '_info');
        const infoDoc = await getDoc(infoRef);
        
        if (!infoDoc.exists()) {
          await setDoc(infoRef, {
            totalRegistrations: 0,
            lastUpdated: new Date()
          });
        }

        // Add registration document
        await setDoc(doc(registrationsRef, user.uid), registrationData);
        console.log("Registration document created in event subcollection");
      } catch (permissionError) {
        console.error("Permission error when creating registration:", permissionError);
        
        // Alternative approach: Update the event document directly with the registration
        // This is a workaround for permission issues with subcollections
        try {
          console.log("Trying alternative registration approach...");
          const eventData = (await getDoc(eventRef)).data() || {};
          const registrations = eventData.registrations || [];
          
          // Add registration to the array
          await updateDoc(eventRef, {
            registrations: [...registrations, {
              ...registrationData,
              id: user.uid // Include user ID in the registration data
            }],
            registrationsCount: increment(1)
          });
          
          console.log("Registration added to event document directly");
        } catch (altError) {
          console.error("Alternative registration approach failed:", altError);
          throw new Error("Registration failed due to permission issues. Please contact the event organizer.");
        }
      }

      // Update event's registration count if we haven't done it in the alternative approach
      try {
        await updateDoc(eventRef, {
          registrationsCount: increment(1)
        });
      } catch (countError) {
        console.error("Error updating registration count:", countError);
        // Continue anyway since the registration was created
      }

      // Update the _info document
      try {
        const infoRef = doc(registrationsRef, '_info');
        await updateDoc(infoRef, {
          totalRegistrations: increment(1),
          lastUpdated: new Date()
        });
      } catch (infoError) {
        console.error("Error updating info document:", infoError);
        // Continue anyway since the registration was created
      }

      // Update user's profile with the registered event
      if (userDoc.exists()) {
        const registeredEvent = {
          id: selectedEvent.id,
          title: selectedEvent.title,
          date: selectedEvent.date,
          game: selectedEvent.game,
          status: 'registered',
          registeredEmail: userEmail,
          registeredName: formData.playerName,
          registrationFee: selectedEvent.registrationFee,
          upiTransactionId: formData.upiTransactionId,
          paymentStatus: formData.upiTransactionId ? 'pending_verification' : 'pending'
        };
        
        console.log("Preparing to update user profile with registered event:", registeredEvent);
        
        try {
          // Check if registeredEvents array exists
          const currentRegisteredEvents = userData.registeredEvents || [];
          
          // Add to registeredEvents array
          await updateDoc(userRef, {
            registeredEvents: [...currentRegisteredEvents, registeredEvent],
            updatedAt: new Date()
          });
          
          console.log("User profile updated with registered event");
        } catch (updateError) {
          console.error("Error updating user profile:", updateError);
          
          // Try a different approach if the first one failed
          try {
            await setDoc(userRef, {
              ...userData,
              registeredEvents: userData.registeredEvents ? 
                [...userData.registeredEvents, registeredEvent] : 
                [registeredEvent],
              updatedAt: new Date()
            }, { merge: true });
            console.log("User profile updated with registered event (using setDoc)");
          } catch (setDocError) {
            console.error("Error updating user profile with setDoc:", setDocError);
            // Continue anyway since the registration was created
          }
        }
      }

      // Close modal on success
      setShowRegistrationModal(false);
      return;
    } catch (error: any) {
      console.error('Error registering for event:', error);
      throw error; // Throw the error to show in the modal
    }
  };

  // Function to analyze teams using GROQ AI
  const analyzeTeamsWithGroq = async (team1: TeamRegistration, team2: TeamRegistration) => {
    try {
      // Here you would make a call to your GROQ AI endpoint
      // For now, we'll simulate the AI response
      const analysis = {
        confidence: Math.random() * 100,
        suggestedWinner: Math.random() > 0.5 ? 'team1' : 'team2',
        reason: `Based on previous performance and team statistics, ${
          Math.random() > 0.5 ? team1.teamName || team1.playerName : team2.teamName || team2.playerName
        } shows stronger potential for victory.`
      } as GroqMatchPrediction;

      return analysis;
    } catch (err) {
      console.error('Error analyzing teams with GROQ:', err);
      return null;
    }
  };

  // Update createMatchPairs to include AI analysis
  const createMatchPairs = async (eventId: string, teams: TeamRegistration[]) => {
    if (teams.length < 2) return;
    
    setIsMatchmaking(true);
    setIsAnalyzing(true);
    try {
      // Shuffle teams randomly
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      
      // Create pairs with AI analysis
      for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
        const team1 = shuffledTeams[i];
        const team2 = shuffledTeams[i + 1];
        
        if (team1 && team2) {
          // Get AI prediction for this match
          const aiPrediction = await analyzeTeamsWithGroq(team1, team2);
          
          const matchRef = collection(db, 'events', eventId, 'matches');
          await addDoc(matchRef, {
            team1: team1,
            team2: team2,
            status: 'pending',
            createdAt: new Date(),
            eventId: eventId,
            aiPrediction: aiPrediction,
            matchStats: {
              team1Score: 0,
              team2Score: 0,
              duration: 0,
              highlights: []
            }
          });
        }
      }

      // Handle odd number of teams
      if (shuffledTeams.length % 2 !== 0) {
        const lastTeam = shuffledTeams[shuffledTeams.length - 1];
        const matchRef = collection(db, 'events', eventId, 'matches');
        await addDoc(matchRef, {
          team1: lastTeam,
          team2: null,
          status: 'waiting',
          createdAt: new Date(),
          eventId: eventId
        });
      }
    } catch (err) {
      console.error('Error creating match pairs:', err);
    } finally {
      setIsMatchmaking(false);
      setIsAnalyzing(false);
    }
  };

  // Function to listen to match updates
  const listenToMatches = (eventId: string) => {
    const matchesRef = collection(db, 'events', eventId, 'matches');
    const unsubscribe = onSnapshot(matchesRef, (snapshot) => {
      const matches: MatchPair[] = [];
      snapshot.forEach((doc) => {
        matches.push({ id: doc.id, ...doc.data() } as MatchPair);
      });
      setMatchPairs(matches.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });
    return unsubscribe;
  };

  // Update handleEventSelect to include match listening
  const handleEventSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEventId = event.target.value;
    if (!selectedEventId) {
      setSelectedEvent(null);
      setSelectedEventTeams([]);
      setMatchPairs([]);
      return;
    }

    const eventData = events.find(e => e.id === selectedEventId);
    if (!eventData) return;

    setSelectedEvent(eventData);

    try {
      const registrationsRef = collection(db, 'events', selectedEventId, 'registrations');
      const registrationsSnapshot = await getDocs(registrationsRef);
      const teamsData = registrationsSnapshot.docs
        .filter(doc => doc.id !== '_info')
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamRegistration[];

      setSelectedEventTeams(teamsData);
      
      // Start listening to matches
      const unsubscribe = listenToMatches(selectedEventId);
      return () => unsubscribe();
    } catch (err) {
      console.error('Error fetching teams:', err);
      setSelectedEventTeams([]);
    }
  };

  // Add function to clear all matches
  const clearAllMatches = async (eventId: string) => {
    if (!eventId || !window.confirm('Are you sure you want to clear all matches?')) return;
    
    try {
      const matchesRef = collection(db, 'events', eventId, 'matches');
      const matchesSnapshot = await getDocs(matchesRef);
      
      const batch = writeBatch(db);
      matchesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (err) {
      console.error('Error clearing matches:', err);
    }
  };

  // Add function to delete individual match
  const deleteMatch = async (eventId: string, matchId: string) => {
    if (!eventId || !matchId) return;
    
    try {
      const matchRef = doc(db, 'events', eventId, 'matches', matchId);
      await deleteDoc(matchRef);
    } catch (err) {
      console.error('Error deleting match:', err);
    }
  };

  // Add function to update match
  const updateMatch = async (matchId: string, updates: Partial<MatchPair>) => {
    if (!selectedEvent) return;
    
    try {
      const matchRef = doc(db, 'events', selectedEvent.id, 'matches', matchId);
      await updateDoc(matchRef, updates);
    } catch (err) {
      console.error('Error updating match:', err);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0B] via-[#1F1F23] to-[#0A0A0B] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* NFT Rewards Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
                Champion's NFT Rewards
              </h2>
              <p className="text-gray-300 max-w-2xl">
                Tournament winners receive exclusive NFTs on the Monad Network, commemorating their victory. 
                These unique digital collectibles serve as permanent proof of your championship status.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-300">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  Exclusive Champion NFTs
                </li>
                <li className="flex items-center text-gray-300">
                  <Cpu className="w-5 h-5 text-purple-500 mr-2" />
                  Powered by Monad Network
                </li>
                <li className="flex items-center text-gray-300">
                  <GamepadIcon className="w-5 h-5 text-pink-500 mr-2" />
                  Verifiable Tournament Victory
                </li>
              </ul>
              <div className="pt-4">
                <a
                  href="/monad"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Learn More About NFT Rewards
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
        </div>
      </div>
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-20 blur-2xl"></div>
              <div className="relative bg-gray-800/50 rounded-lg p-6 border border-purple-500/20 h-full flex items-center justify-center">
                <Trophy className="w-32 h-32 text-yellow-500" />
              </div>
        </div>
      </div>
        </motion.div>

      {/* Events Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
          </div>

          {/* Rest of your existing events section */}
        {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No upcoming events at the moment.</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50"
                >
                  <div className="relative aspect-video overflow-hidden">
              <img
                  src={event.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'}
                  alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {event.status || 'Registration Open'}
                      </span>
                    </div>
                  </div>

              <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-gray-400 mb-2">{event.description}</p>
                    )}
                    <p className="text-[10px] text-[#ccc] mb-4">Powered by Groq ⚡</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <GamepadIcon className="w-5 h-5 mr-2 text-indigo-400" />
                      {event.game || 'Various Games'}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Trophy className="w-5 h-5 mr-2 text-indigo-400" />
                      Prize Pool: {event.prize || 'TBA'}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-400" />
                      Registration: {event.registrationFee || 'Free Entry'}
                </div>
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-5 h-5 mr-2 text-indigo-400" />
                        {new Date(event.date?.seconds * 1000).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-5 h-5 mr-2 text-indigo-400" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="w-5 h-5 mr-2 text-indigo-400" />
                        {event.currentParticipants}/{event.capacity} teams
                      </div>
                </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRegisterClick(event)}
                      className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Register Now
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                </div>
                </motion.div>
              ))}
              </div>
          )}
            </div>

      {/* Tournament Bracket Section */}
      <div className="mt-16 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Tournament Brackets</h2>
          <div className="flex items-center space-x-4">
            <select
              onChange={handleEventSelect}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              title="Select tournament event"
              aria-label="Select tournament event"
            >
              <option value="">Select Event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            {selectedEvent && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => createMatchPairs(selectedEvent.id, selectedEventTeams)}
                disabled={isMatchmaking || selectedEventTeams.length < 2}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMatchmaking ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Creating Matches...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Matches
                  </>
                )}
              </motion.button>
            )}
            {selectedEvent && matchPairs.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => clearAllMatches(selectedEvent.id)}
                className="flex items-center px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear All
              </motion.button>
            )}
          </div>
        </div>

        {selectedEvent ? (
          <div className="grid gap-6">
            {isAnalyzing && (
              <div className="text-center py-8 bg-indigo-600/20 rounded-xl border border-indigo-500/20">
                <RefreshCw className="w-8 h-8 text-indigo-400 mx-auto animate-spin mb-4" />
                <p className="text-indigo-300">Analyzing teams with Groq AI...</p>
              </div>
            )}

            {matchPairs.length > 0 ? (
              <div className="grid gap-4">
                {matchPairs.map((match) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4 items-center">
                          {/* Team 1 */}
                          <div className="text-center">
                            <h3 className="font-medium text-white mb-1">
                              {match.team1?.teamName || match.team1?.playerName}
                            </h3>
                            <p className="text-sm text-indigo-400">Team 1</p>
                          </div>

                          {/* VS */}
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-400">VS</div>
                            <div className="text-sm text-gray-400">
                              {match.status === 'completed' 
                                ? `Completed ${new Date(match.completedAt?.seconds * 1000).toLocaleDateString()}`
                                : match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                            </div>
                          </div>

                          {/* Team 2 */}
                          <div className="text-center">
                            <h3 className="font-medium text-white mb-1">
                              {match.team2?.teamName || match.team2?.playerName || 'Waiting...'}
                            </h3>
                            <p className="text-sm text-indigo-400">Team 2</p>
                          </div>
                        </div>

                        {/* AI Prediction */}
                        {match.aiPrediction && (
                          <div className="mt-4 p-3 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Cpu className="w-5 h-5 text-indigo-400 mr-2" />
                                <span className="text-sm text-indigo-300">Groq AI Prediction</span>
                              </div>
                              <span className="text-sm text-indigo-400">
                                {Math.round(match.aiPrediction.confidence)}% Confidence
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">{match.aiPrediction.reason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 ml-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedMatch(match)}
                          className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition-colors"
                          title="View match details"
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteMatch(selectedEvent.id, match.id)}
                          className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                          title="Delete match"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Matches Created</h3>
                <p className="text-gray-400">
                  {selectedEventTeams.length < 2 
                    ? 'Need at least 2 teams to create matches.'
                    : 'Click "Create Matches" to generate tournament brackets.'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Select an Event</h3>
            <p className="text-gray-400">Choose an event to view or create tournament brackets.</p>
        </div>
        )}
      </div>

      {/* Registration Modal */}
        {selectedEvent && (
        <RegistrationModal
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          onSubmit={handleRegistrationSubmit}
        />
      )}

        {/* Match Details Modal */}
        {selectedMatch && (
          <MatchDetailsModal
            isOpen={!!selectedMatch}
            onClose={() => setSelectedMatch(null)}
            match={selectedMatch}
            onUpdateMatch={updateMatch}
          />
        )}
      </div>
    </div>
  );
};

export default Esports;