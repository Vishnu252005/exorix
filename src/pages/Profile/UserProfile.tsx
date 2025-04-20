import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, createEvent, updateEvent, createBlog, updateBlog, createJob } from '../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Clock,
  MapPin,
  PlusCircle,
  Edit3,
  FileText,
  Briefcase,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  Search,
  BarChart2,
  Trophy,
  MessageSquare,
  DollarSign,
  Gamepad2,
  Smile,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileAvatar from '../../components/ProfileAvatar';
import CreateEventModal from '../../components/CreateEventModal';
import EditEventModal from '../../components/EditEventModal';
import CreateBlogModal from '../../components/CreateBlogModal';
import EditBlogModal from '../../components/EditBlogModal';
import CreateJobModal from '../../components/CreateJobModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: any;
  events?: Array<{
    id: string;
    title: string;
    date: any;
    status: 'upcoming' | 'completed';
  }>;
  registeredEvents?: Array<{
    id: string;
    title: string;
    date: any;
    game: string;
    status: string;
    registeredEmail?: string;
    registeredName?: string;
    registrationFee?: string;
    upiTransactionId?: string;
    paymentStatus?: string;
  }>;
  blogs?: Array<{
    id: string;
    title: string;
    createdAt: any;
    likes: number;
    comments: number;
  }>;
  jobs?: Array<{
    id: string;
    title: string;
    department: string;
    createdAt: any;
  }>;
  avatar?: string;
}

interface AvatarStyle {
  id: string;
  name: string;
  preview: string;
}

const AVATAR_STYLES: AvatarStyle[] = [
  { id: 'avataaars', name: 'Default', preview: 'https://api.dicebear.com/7.x/avataaars/svg?seed=preview1' },
  { id: 'pixel-art', name: 'Pixel Art', preview: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=preview2' },
  { id: 'bottts', name: 'Robot', preview: 'https://api.dicebear.com/7.x/bottts/svg?seed=preview3' },
  { id: 'lorelei', name: 'Anime', preview: 'https://api.dicebear.com/7.x/lorelei/svg?seed=preview4' },
  { id: 'adventurer', name: 'Adventure', preview: 'https://api.dicebear.com/7.x/adventurer/svg?seed=preview5' },
  { id: 'fun-emoji', name: 'Emoji', preview: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=preview6' },
  { id: 'thumbs', name: 'Thumbs', preview: 'https://api.dicebear.com/7.x/thumbs/svg?seed=preview7' },
  { id: 'initials', name: 'Initials', preview: 'https://api.dicebear.com/7.x/initials/svg?seed=preview8' },
  { id: 'notionists', name: 'Notionist', preview: 'https://api.dicebear.com/7.x/notionists/svg?seed=preview9' },
  { id: 'micah', name: 'Micah', preview: 'https://api.dicebear.com/7.x/micah/svg?seed=preview10' },
  { id: 'personas', name: 'Persona', preview: 'https://api.dicebear.com/7.x/personas/svg?seed=preview11' },
  { id: 'miniavs', name: 'Mini', preview: 'https://api.dicebear.com/7.x/miniavs/svg?seed=preview12' },
  { id: 'open-peeps', name: 'Peeps', preview: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=preview13' },
  { id: 'big-smile', name: 'Big Smile', preview: 'https://api.dicebear.com/7.x/big-smile/svg?seed=preview14' },
  { id: 'croodles', name: 'Doodle', preview: 'https://api.dicebear.com/7.x/croodles/svg?seed=preview15' }
];

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [fixingData, setFixingData] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<{ [key: string]: boolean }>({});
  const [eventRegistrations, setEventRegistrations] = useState<{ [key: string]: any[] }>({});
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBlogs: 0,
    totalJobs: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  });

  // Add a new state for tournaments loading
  const [refreshingTournaments, setRefreshingTournaments] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('avataaars');
  const [avatarSeed, setAvatarSeed] = useState<string>(() => user?.email?.split('@')[0] || 'default');
  const [currentAvatar, setCurrentAvatar] = useState<string>('');

  useEffect(() => {
    if (userData?.avatar) {
      setCurrentAvatar(userData.avatar);
    } else {
      setCurrentAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${avatarSeed}`);
    }
  }, [userData, selectedStyle, avatarSeed]);

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    setCurrentAvatar(`https://api.dicebear.com/7.x/${style}/svg?seed=${avatarSeed}`);
  };

  const handleRandomize = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
    setCurrentAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${newSeed}`);
  };

  const handleSaveAvatar = async () => {
    try {
      if (!user) return;
      
      await updateDoc(doc(db, 'users', user.uid), {
        avatar: currentAvatar
      });
      
      toast.success('Avatar updated successfully!');
      setShowAvatarModal(false);
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar');
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setError('Profile not found');
        return;
      }

      // Get all events created by the user
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const userEvents: Array<{
        id: string;
        title: string;
        date: any;
        status: 'upcoming' | 'completed';
      }> = [];

      for (const eventDoc of eventsSnapshot.docs) {
        const eventData = eventDoc.data();
        if (eventData.createdBy === user.uid) {
          userEvents.push({
            id: eventDoc.id,
            title: eventData.title || '',
            date: eventData.date,
            status: eventData.status || 'upcoming'
          });
        }
      }

      // Update user document with latest events
      const data = userDoc.data() as UserData;
      const updatedData: UserData = {
        ...data,
        events: userEvents
      };

      // Format data for Firestore update
      const firestoreData = {
        events: userEvents,
        updatedAt: new Date()
      };

      await updateDoc(userDocRef, firestoreData);
      setUserData(updatedData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError('Failed to refresh profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setError('Profile not found');
          return;
        }

        const data = userDoc.data() as UserData;
        console.log("User profile data loaded:", data);
        console.log("Registered events:", data.registeredEvents || "none");
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out');
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      setLoading(true);
      const result = await createEvent(eventData);
      if (result.success) {
        setShowCreateEventModal(false);
        // Refresh user data to show new event
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = async (eventData: any) => {
    try {
      if (!selectedEvent) return;
      
      const result = await updateEvent(selectedEvent.id, eventData);
      if (result.success) {
        setShowEditEventModal(false);
        setSelectedEvent(null);
        // Refresh user data to show updated event
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    }
  };

  const openEditModal = async (event: any) => {
    try {
      // Get full event details from Firestore
      const eventDoc = await getDoc(doc(db, 'events', event.id));
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        setSelectedEvent({
          id: event.id,
          ...eventData
        });
        setShowEditEventModal(true);
      }
    } catch (err: any) {
      console.error('Error fetching event details:', err);
      setError(err.message || 'Failed to fetch event details');
    }
  };

  const handleCreateBlog = async (blogData: any) => {
    try {
      const result = await createBlog(blogData);
      if (result.success) {
        setShowCreateBlogModal(false);
        // Refresh user data to show new blog
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create blog');
    }
  };

  const handleEditBlog = async (blogData: any) => {
    try {
      if (!selectedBlog) return;
      const result = await updateBlog(selectedBlog.id, blogData);
      if (result.success) {
        setShowEditBlogModal(false);
        setSelectedBlog(null);
        // Refresh user data to show updated blog
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update blog');
    }
  };

  const openEditBlogModal = async (blog: any) => {
    try {
      // Get full blog details from Firestore
      const blogDoc = await getDoc(doc(db, 'blogs', blog.id));
      if (blogDoc.exists()) {
        const blogData = blogDoc.data();
        setSelectedBlog({
          id: blog.id,
          ...blogData
        });
        setShowEditBlogModal(true);
      }
    } catch (err: any) {
      console.error('Error fetching blog details:', err);
      setError(err.message || 'Failed to fetch blog details');
    }
  };

  // Modify the checkAndFixRegisteredEvents function
  const checkAndFixRegisteredEvents = async () => {
    if (!user) return;
    
    setRefreshingTournaments(true);
    try {
      // Get all events
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      
      let userRegisteredEvents = [];
      
      // Check each event for registrations by this user
      for (const eventDoc of eventsSnapshot.docs) {
        const eventData = eventDoc.data();
        const eventId = eventDoc.id;
        
        // Check if user is registered for this event
        const registrationsRef = collection(db, 'events', eventId, 'registrations');
        const userRegDoc = await getDoc(doc(registrationsRef, user.uid));
        
        if (userRegDoc.exists()) {
          const regData = userRegDoc.data();
          
          // Add to registered events array
          userRegisteredEvents.push({
            id: eventId,
            title: eventData.title || "Unknown Event",
            date: eventData.date || new Date(),
            game: eventData.game || "Not specified",
            status: 'registered',
            registeredEmail: regData.email || regData.userEmail || user.email,
            registeredName: regData.playerName || "Not specified",
            registrationFee: regData.registrationFee,
            upiTransactionId: regData.upiTransactionId,
            paymentStatus: regData.paymentStatus
          });
        }
      }
      
      if (userRegisteredEvents.length > 0) {
        // Update user document with found registrations
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          registeredEvents: userRegisteredEvents,
          updatedAt: new Date()
        });
        
        // Only update the registeredEvents in the userData state
        setUserData(prevData => {
          if (!prevData) return null;
          return {
            ...prevData,
            registeredEvents: userRegisteredEvents
          };
        });
      }
    } catch (err) {
      console.error("Error fixing registered events:", err);
    } finally {
      setRefreshingTournaments(false);
    }
  };

  const handleCreateJob = async (jobData: any) => {
    try {
      setLoading(true);
      const result = await createJob(jobData);
      if (result.success) {
        setShowCreateJobModal(false);
        // Show success message
        alert(result.message || "Job opening created successfully!");
        // Refresh user data to show new job
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        }
      } else {
        setError(result.error);
        alert(`Error creating job opening: ${result.error}`);
      }
    } catch (err: any) {
      console.error('Error creating job opening:', err);
      setError(err.message || 'Failed to create job opening');
      alert(`Error creating job opening: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleEventExpansion = async (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));

    // Fetch registrations if not already loaded
    if (!eventRegistrations[eventId]) {
      try {
        const registrationsRef = collection(db, 'events', eventId, 'registrations');
        const registrationsSnapshot = await getDocs(registrationsRef);
        const registrations = registrationsSnapshot.docs
          .filter(doc => doc.id !== '_info') // Exclude the _info document
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        setEventRegistrations(prev => ({
          ...prev,
          [eventId]: registrations
        }));
      } catch (err) {
        console.error('Error fetching registrations:', err);
      }
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Get total events
      const eventsQuery = query(collection(db, 'events'), where('createdBy', '==', user.uid));
      const eventsSnapshot = await getDocs(eventsQuery);
      const totalEvents = eventsSnapshot.size;

      // Get total blogs
      const blogsQuery = query(collection(db, 'blogs'), where('createdBy', '==', user.uid));
      const blogsSnapshot = await getDocs(blogsQuery);
      const totalBlogs = blogsSnapshot.size;

      // Get total jobs
      const jobsQuery = query(collection(db, 'jobs'), where('createdBy', '==', user.uid));
      const jobsSnapshot = await getDocs(jobsQuery);
      const totalJobs = jobsSnapshot.size;

      // Calculate total registrations and revenue
      let totalRegistrations = 0;
      let totalRevenue = 0;

      for (const eventDoc of eventsSnapshot.docs) {
        const registrationsQuery = collection(db, 'events', eventDoc.id, 'registrations');
        const registrationsSnapshot = await getDocs(registrationsQuery);
        totalRegistrations += registrationsSnapshot.size;

        // Calculate revenue from registrations
        registrationsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.registrationFee) {
            totalRevenue += parseFloat(data.registrationFee);
          }
        });
      }

      setStats({
        totalEvents,
        totalBlogs,
        totalJobs,
        totalRegistrations,
        totalRevenue
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50">
            <div className="text-red-400 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
            <p className="text-gray-300 mb-6">{error || 'Failed to load profile data'}</p>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 border border-red-500 text-red-500 rounded-lg px-4 py-2 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex pt-24">
      {/* Sidebar */}
      <div className="fixed left-0 top-24 bottom-0 w-64 bg-gray-800/30 backdrop-blur-sm border-r border-gray-700/50 p-6 overflow-y-auto">
        <div className="flex items-center space-x-4 mb-8">
          {/* Avatar Section */}
          <div className="relative w-20 h-20 group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
            <img 
              src={currentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.email}`}
              alt="Admin Avatar"
              className="w-full h-full rounded-full border-2 border-gray-200 transition-all duration-200 group-hover:border-indigo-500"
            />
                <button
              className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Change Avatar"
              aria-label="Open avatar customization"
                >
              <Smile className="w-6 h-6 text-white mb-1" />
              <span className="text-xs text-white font-medium">Change</span>
                </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{userData.firstName} {userData.lastName}</h2>
            <p className="text-sm text-gray-400 flex items-center">
              <User className="w-4 h-4 mr-1" />
              User
            </p>
                <button
              onClick={() => setShowAvatarModal(true)}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
              title="Customize your avatar"
                >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit Avatar
                </button>
          </div>
        </div>

        <nav className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('tournaments')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'tournaments' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Your Tournaments</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Events</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'blogs' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Blogs</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('jobs')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Jobs</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </motion.button>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
          </motion.button>
              </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'tournaments' && 'Your Tournaments'}
            {activeTab === 'events' && 'Events'}
            {activeTab === 'blogs' && 'Blogs'}
            {activeTab === 'jobs' && 'Jobs'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-300" />
            </motion.button>
            </div>
          </div>

        {/* Tournaments View */}
        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                <h2 className="text-xl font-bold">Registered Tournaments</h2>
                <p className="text-gray-400 text-sm mt-1">View and manage your tournament registrations</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/esports')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Trophy className="w-5 h-5" />
                <span>Browse Tournaments</span>
              </motion.button>
            </div>

            <div className="grid gap-6 relative">
              {refreshingTournaments && (
                <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                    <span className="text-white">Refreshing tournaments...</span>
                  </div>
                </div>
              )}

              {userData.registeredEvents && userData.registeredEvents.length > 0 ? (
                userData.registeredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">{event.title}</h3>
                        <div className="space-y-1 mt-2">
                          <p className="text-sm text-gray-400">
                            <span className="text-gray-500">Game:</span> {event.game || "Not specified"}
                          </p>
                          <p className="text-sm text-gray-400">
                            <span className="text-gray-500">Registered as:</span> {event.registeredName}
                          </p>
                          {event.registrationFee && (
                            <p className="text-sm text-gray-400">
                              <span className="text-gray-500">Registration Fee:</span> ₹{event.registrationFee}
                            </p>
                          )}
                          {event.upiTransactionId && (
                            <p className="text-sm text-gray-400">
                              <span className="text-gray-500">Transaction ID:</span> {event.upiTransactionId}
                            </p>
                          )}
                </div>
              </div>
                      <div className="flex flex-col items-end space-y-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.paymentStatus === 'verified' 
                            ? 'bg-green-500/20 text-green-400'
                            : event.paymentStatus === 'pending_verification'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {event.paymentStatus === 'verified' 
                            ? 'Payment Verified' 
                            : event.paymentStatus === 'pending_verification'
                            ? 'Verification Pending'
                            : 'Payment Pending'}
                        </span>
                        <p className="text-sm text-gray-400">
                          {event.date ? 
                            (event.date?.toDate ? 
                              event.date.toDate().toLocaleDateString() : 
                              new Date(event.date.seconds ? event.date.seconds * 1000 : event.date).toLocaleDateString()
                            ) : 
                            "Date not available"
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                  <Gamepad2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-white">No tournaments registered</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Browse available tournaments and register to participate.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/esports')}
                    className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Browse Tournaments
                  </motion.button>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={checkAndFixRegisteredEvents}
                disabled={refreshingTournaments}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshingTournaments ? 'animate-spin' : ''}`} />
                <span>{refreshingTournaments ? 'Refreshing...' : 'Refresh Registrations'}</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400">Total Events</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stats.totalEvents}</h3>
                </div>
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <Trophy className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Blogs</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stats.totalBlogs}</h3>
          </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Jobs</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stats.totalJobs}</h3>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Briefcase className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-white mt-1">₹{stats.totalRevenue}</h3>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Events and Blogs */}
            <div className="space-y-8">
          {/* Events Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
            <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Events</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateEventModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Event</span>
                  </motion.button>
            </div>

                {/* Events List */}
            {userData.events && userData.events.length > 0 ? (
                  <div className="space-y-4">
                    {userData.events.slice(0, 5).map((event) => (
                      <motion.div
                    key={event.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                  >
                        <div className="flex items-center justify-between">
                      <div>
                            <h3 className="font-medium text-white">{event.title}</h3>
                            <p className="text-sm text-gray-400">
                          {event.date?.toDate ? event.date.toDate().toLocaleDateString() : new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === 'upcoming' || event.status.includes('Registration')
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {event.status}
                        </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(event)}
                              className="text-indigo-400 hover:text-indigo-300"
                              title="Edit Event"
                        >
                          <Edit3 className="w-5 h-5" />
                            </motion.button>
                      </div>
                    </div>
                      </motion.div>
                ))}
              </div>
            ) : (
                  <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-white">No events yet</h3>
                    <p className="mt-1 text-sm text-gray-400">
                  Get started by creating your first event.
                </p>
              </div>
            )}
              </motion.div>

              {/* Blogs Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
              >
            <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Recent Blogs</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateBlogModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Blog</span>
                  </motion.button>
              </div>

                {/* Blogs List */}
                {userData.blogs && userData.blogs.length > 0 ? (
                  <div className="space-y-4">
                    {userData.blogs.slice(0, 5).map((blog) => (
                      <motion.div
                        key={blog.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                      <div>
                            <h3 className="font-medium text-white">{blog.title || "Untitled Blog"}</h3>
                            <p className="text-sm text-gray-400">
                              {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openEditBlogModal(blog)}
                              className="text-indigo-400 hover:text-indigo-300"
                              title="Edit Blog"
                            >
                              <Edit3 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-white">No blogs yet</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Get started by creating your first blog post.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}

        {/* Events View */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">All Events</h2>
                <p className="text-gray-400 text-sm mt-1">Manage your events and registrations</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateEventModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Event</span>
              </motion.button>
            </div>

            <div className="grid gap-6">
              {userData.events && userData.events.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{event.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {event.date?.toDate ? event.date.toDate().toLocaleDateString() : new Date(event.date).toLocaleDateString()}
                      </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === 'upcoming' || event.status.includes('Registration')
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {event.status}
                        </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(event)}
                        className="text-indigo-400 hover:text-indigo-300"
                        title="Edit Event"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                      </div>
                    </div>
                </motion.div>
                ))}
              </div>
              </div>
            )}

        {/* Blogs View */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">All Blogs</h2>
                <p className="text-gray-400 text-sm mt-1">Manage your blog posts</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateBlogModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Blog</span>
              </motion.button>
            </div>

            <div className="grid gap-6">
              {userData.blogs && userData.blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                      <div>
                      <h3 className="text-lg font-medium text-white">{blog.title || "Untitled Blog"}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditBlogModal(blog)}
                        className="text-indigo-400 hover:text-indigo-300"
                        title="Edit Blog"
                        >
                          <Edit3 className="w-5 h-5" />
                      </motion.button>
                      </div>
                    </div>
                </motion.div>
                ))}
              </div>
              </div>
            )}

        {/* Jobs View */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">All Jobs</h2>
                <p className="text-gray-400 text-sm mt-1">Manage your job postings</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateJobModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Job</span>
              </motion.button>
            </div>

            <div className="grid gap-6">
              {userData.jobs && userData.jobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                      <div>
                      <h3 className="text-lg font-medium text-white">{job.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {job.department} • Created on {job.createdAt.toDate().toLocaleDateString()}
                      </p>
                      </div>
                      <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/jobs/${job.id}/edit`)}
                        className="text-indigo-400 hover:text-indigo-300"
                        title="Edit Job"
                        >
                          <Edit3 className="w-5 h-5" />
                      </motion.button>
                      </div>
                    </div>
                </motion.div>
                ))}
              </div>
              </div>
            )}

        {/* Settings View */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm text-gray-400">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    value={`${userData.firstName} ${userData.lastName}`}
                    disabled
                    aria-label="Full Name"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                  />
          </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-400">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={userData.email}
                    disabled
                    aria-label="Email"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="memberSince" className="text-sm text-gray-400">Member Since</label>
                  <input
                    id="memberSince"
                    type="text"
                    value={userData.createdAt?.toDate().toLocaleDateString()}
                    disabled
                    aria-label="Member Since Date"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                  />
                </div>
        </div>
      </div>
      
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
                >
                  <span>Change Password</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
                >
                  <span>Notification Settings</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <span>Logout</span>
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onSubmit={handleCreateEvent}
      />

      <EditEventModal
        isOpen={showEditEventModal}
        onClose={() => {
          setShowEditEventModal(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleEditEvent}
        eventData={selectedEvent}
      />

      <CreateBlogModal
        isOpen={showCreateBlogModal}
        onClose={() => setShowCreateBlogModal(false)}
        onSubmit={handleCreateBlog}
      />

      <EditBlogModal
        isOpen={showEditBlogModal}
        onClose={() => {
          setShowEditBlogModal(false);
          setSelectedBlog(null);
        }}
        onSubmit={handleEditBlog}
        blogData={selectedBlog}
      />

      <CreateJobModal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        onSubmit={handleCreateJob}
      />

      {/* Avatar Customization Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full mx-4 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-700/50 pb-4">
              <h3 className="text-xl font-bold text-white">Choose Your Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                title="Close modal"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-800 border-4 border-indigo-600">
                <img 
                  src={currentAvatar} 
                  alt="Current Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto p-2">
              {AVATAR_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleChange(style.id)}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    selectedStyle === style.id
                      ? 'border-indigo-600 bg-indigo-600/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-2">
                    <img 
                      src={style.preview} 
                      alt={style.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-center text-white">{style.name}</p>
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <button
                onClick={handleRandomize}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Randomize
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAvatar}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center font-medium"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 