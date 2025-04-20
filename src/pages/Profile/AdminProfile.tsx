import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, createEvent, createJob } from '../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  LogOut,
  Users,
  BarChart,
  Loader,
  PlusCircle,
  Briefcase,
  Eye,
  Clock,
  ArrowUpRight,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  Trophy,
  MessageSquare,
  DollarSign,
  Gamepad2,
  Plus,
  Medal,
  Smile,
  RefreshCw,
  Check,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileAvatar from '../../components/ProfileAvatar';
import CreateEventModal from '../../components/CreateEventModal';
import CreateJobModal from '../../components/CreateJobModal';
import { useAuth } from '../../context/AuthContext';
import { Timestamp } from 'firebase/firestore';
import NFTRewards from '../admin/NFTRewards';
import { toast } from 'react-hot-toast';

interface AdminData {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdAt: any;
  events?: Array<{
    id: string;
    title: string;
    date: any;
    status: 'upcoming' | 'completed';
    registeredUsers?: string[];
  }>;
  jobs?: Array<{
    id: string;
    title: string;
    department: string;
    createdAt: any;
  }>;
  blogs?: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: any;
    likes: number;
    comments: number;
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

const AdminProfile = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    activeEvents: 0,
    totalJobs: 0,
    totalBlogs: 0
  });
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: ''
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('avataaars');
  const [avatarSeed, setAvatarSeed] = useState<string>(() => adminData?.email?.split('@')[0] || 'default');
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const userEvents = eventsSnapshot.docs.filter(doc => doc.data().createdBy === user.uid);
      
      const blogsCollection = collection(db, 'blogs');
      const blogsSnapshot = await getDocs(blogsCollection);
      const userBlogs = blogsSnapshot.docs.filter(doc => doc.data().createdBy === user.uid);

      const jobsCollection = collection(db, 'jobs');
      const jobsSnapshot = await getDocs(jobsCollection);
      const userJobs = jobsSnapshot.docs.filter(doc => doc.data().createdBy === user.uid);

      let totalRegistrations = 0;
      let activeEvents = 0;

      userEvents.forEach(event => {
        const eventData = event.data();
        if (eventData.registeredUsers) {
          totalRegistrations += eventData.registeredUsers.length;
        }
        if (eventData.status === 'upcoming') {
          activeEvents++;
        }
      });

      setStats({
        totalEvents: userEvents.length,
        totalRegistrations,
        activeEvents,
        totalJobs: userJobs.length,
        totalBlogs: userBlogs.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
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

        const data = userDoc.data() as AdminData;
        
        if (!data.isAdmin) {
          navigate('/profile');
          return;
        }

        setAdminData(data);
        await fetchStats();
        setError(null);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  useEffect(() => {
    if (adminData?.avatar) {
      setCurrentAvatar(adminData.avatar);
    } else {
      setCurrentAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${avatarSeed}`);
    }
  }, [adminData, selectedStyle, avatarSeed]);

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
        // Refresh admin data to show new event
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setAdminData(userDoc.data() as AdminData);
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

  const handleCreateJob = async (jobData: any) => {
    try {
      setLoading(true);
      const result = await createJob(jobData);
      if (result.success) {
        setShowCreateJobModal(false);
        // Refresh admin data to show new job
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setAdminData(userDoc.data() as AdminData);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      console.error('Error creating job opening:', err);
      setError(err.message || 'Failed to create job opening');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    if (!user) return;
    
    try {
      const blogData = {
        title: newBlog.title,
        content: newBlog.content,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
        likes: 0,
        comments: 0
      };

      const blogRef = await addDoc(collection(db, 'blogs'), blogData);
      
      // Update user's blogs array
      const updatedBlogs = [...(adminData?.blogs || []), {
        id: blogRef.id,
        ...blogData
      }];

      await updateDoc(doc(db, 'users', user.uid), {
        blogs: updatedBlogs
      });

      setAdminData(prev => prev ? { ...prev, blogs: updatedBlogs } : null);
      await fetchStats();
      setShowCreateBlogModal(false);
      setNewBlog({ title: '', content: '' });
    } catch (err) {
      console.error('Error creating blog:', err);
      setError('Failed to create blog');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  if (error || !adminData) {
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
              src={currentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminData?.email}`}
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
            <h2 className="text-lg font-semibold text-white">{adminData.firstName} {adminData.lastName}</h2>
            <p className="text-sm text-gray-400 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Admin
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
            onClick={() => setActiveTab('events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Events</span>
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('nft-rewards')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'nft-rewards' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Medal className="w-5 h-5" />
            <span>NFT Rewards</span>
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
            {activeTab === 'events' && 'Events'}
            {activeTab === 'jobs' && 'Jobs'}
            {activeTab === 'settings' && 'Settings'}
            {activeTab === 'nft-rewards' && 'NFT Rewards'}
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
                    <h3 className="text-2xl font-bold text-white mt-1">{adminData.events?.length || 0}</h3>
                  </div>
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Registrations</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {adminData.events?.reduce((acc, event) => acc + (event.registeredUsers?.length || 0), 0) || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Events</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {adminData.events?.filter(event => event.status === 'upcoming').length || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <BarChart className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Job Openings</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{adminData.jobs?.length || 0}</h3>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Briefcase className="w-6 h-6 text-yellow-400" />
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
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Events and Blogs */}
            <div className="space-y-8">
              {/* Recent Events */}
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

                {adminData.events && adminData.events.length > 0 ? (
                  <div className="space-y-4">
                    {adminData.events.slice(0, 5).map((event) => (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                <div>
                            <h3 className="font-medium text-white">{event.title}</h3>
                            <p className="text-sm text-gray-400">
                              {event.date.toDate().toLocaleDateString()}
                            </p>
                </div>
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              event.status === 'upcoming' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {event.status}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate(`/events/${event.id}/edit`)}
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
                  <h2 className="text-xl font-bold text-white">Your Blogs</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateBlogModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Blog</span>
                  </motion.button>
                </div>

                {/* Blogs List */}
                {adminData.blogs && adminData.blogs.length > 0 ? (
                  <div className="space-y-4">
                    {adminData.blogs.map((blog) => (
                      <motion.div
                        key={blog.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-white">{blog.title}</h3>
                            <p className="text-sm text-gray-400">
                              {blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-400">
                                {blog.likes} likes
                              </span>
                              <span className="text-sm text-gray-400">
                                {blog.comments} comments
                              </span>
                            </div>
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
                      Create your first blog to get started.
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
              {adminData.events && adminData.events.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{event.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {event.date.toDate().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === 'upcoming' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {event.status}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/events/${event.id}/edit`)}
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
              {adminData.jobs && adminData.jobs.map((job) => (
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
                    value={`${adminData.firstName} ${adminData.lastName}`}
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
                    value={adminData.email}
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
                    value={adminData.createdAt?.toDate().toLocaleDateString()}
                    disabled
                    aria-label="Member Since Date"
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
            </div>
          )}

        {/* NFT Rewards View */}
        {activeTab === 'nft-rewards' && (
          <div className="space-y-6">
            <NFTRewards />
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateEventModal
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onSubmit={handleCreateEvent}
      />

      <CreateJobModal
        isOpen={showCreateJobModal}
        onClose={() => setShowCreateJobModal(false)}
        onSubmit={handleCreateJob}
      />

      {/* Create Blog Modal */}
      {showCreateBlogModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 max-w-2xl w-full mx-4 border border-gray-700/50"
          >
            <h2 className="text-xl font-bold text-white mb-4">Create New Blog</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  id="blogTitle"
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <label htmlFor="blogContent" className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="blogContent"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 min-h-[200px]"
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateBlogModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateBlog}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Blog
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Avatar Customization Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Customize Your Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
            
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-800 border-4 border-indigo-600">
                <img 
                  src={currentAvatar} 
                  alt="Current Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
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
                  <div className="w-20 h-20 mx-auto mb-2">
                    <img 
                      src={style.preview} 
                      alt={style.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-center text-white">{style.name}</p>
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleRandomize}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Randomize
              </button>
              <button
                onClick={handleSaveAvatar}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile; 