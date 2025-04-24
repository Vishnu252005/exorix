/** @jsxImportSource @emotion/react */
import * as React from 'react';
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, createEvent, createJob } from '../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc, deleteDoc, setDoc, type DocumentData, Timestamp } from 'firebase/firestore';
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
  FileText,
  Trash2,
  MapPin,
  Loader2,
  Cpu,
  Package,
  Tag,
  ShoppingCart,
  X,
  Minus,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileAvatar from '../../components/ProfileAvatar';
import CreateEventModal from '../../components/CreateEventModal';
import CreateJobModal from '../../components/CreateJobModal';
import CreateBlogModal from '../../components/CreateBlogModal';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import NFTRewards from '../admin/NFTRewards';
import { toast } from 'react-hot-toast';
import EditEventModal from '../../components/EditEventModal';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

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

interface Blog {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage: string;
  status: 'draft' | 'published';
  seoKeywords?: string[];
  structure?: string[];
  createdAt: Timestamp;
  createdBy: string;
  likes: number;
  comments: number;
  aiGenerated?: boolean;
  aiPrompt?: string;
}

// Add Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'keyboard' | 'mouse' | 'headset' | 'monitor' | 'accessories' | 'chair' | 'desk' | 'controller';
  brand: string;
  rating: number;
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  isFeatured?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  attendees: string[];
}

interface AdminData {
  name: string;
  email: string;
  phone: string;
  address: string;
  events: EventData[];
  isAdmin: boolean;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  transactionHash?: string;
  createdAt: Timestamp;
  shippingAddress?: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  userEmail: string;
}

const AdminProfile: React.FC = () => {
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
    content: '',
    aiPrompt: ''
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('avataaars');
  const [avatarSeed, setAvatarSeed] = useState<string>(() => adminData?.email?.split('@')[0] || 'default');
  const [currentAvatar, setCurrentAvatar] = useState<string>('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

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
        if (eventData.status === 'Registration Open') {
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData as EventData[]);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Add new useEffect for products
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab]);

  // Add fetchOrders function
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersRef = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersRef);
      
      // Fetch all orders with their user data
      const ordersData = await Promise.all(ordersSnapshot.docs.map(async (doc) => {
        const orderData = doc.data();
        
        // Get user data if userId exists
        let userEmail = 'Unknown';
        if (orderData.userId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', orderData.userId));
            if (userDoc.exists()) {
              userEmail = userDoc.data().email || 'Unknown';
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
          }
        }

        return {
          id: doc.id,
          ...orderData,
          userEmail,
        } as Order;
      }));

      // Sort orders by creation date, handling undefined or invalid dates
      const sortedOrders = ordersData.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
        return dateB - dateA; // Sort in descending order (newest first)
      });

      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Add useEffect for orders
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

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
      // Create the event document with registration fields
      const eventRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdBy: user?.uid,
        creatorEmail: user?.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        registeredUsers: [],
        status: eventData.status || 'Registration Open'
      });

      // Create the registrations subcollection with _info document
      await setDoc(doc(eventRef, 'registrations', '_info'), {
        totalRegistrations: 0,
        lastUpdated: new Date(),
        registrationConfig: {
          requirePayment: !!eventData.registrationFee,
          paymentAmount: eventData.registrationFee,
          paymentInstructions: eventData.paymentInstructions,
          upiId: eventData.upiId,
          organizerPhone: eventData.organizerPhone
        }
      });

      setShowCreateEventModal(false);
      // Refresh admin data to show new event
      await fetchStats();
      toast.success('Event created successfully!');
    } catch (err: any) {
      console.error('Error creating event:', err);
      toast.error(err.message || 'Failed to create event');
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

  const generateBlogContent = async (prompt: string) => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/groq/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setNewBlog(prev => ({
        ...prev,
        content: data.content,
        aiGenerated: true,
        aiPrompt: prompt
      }));
    } catch (err) {
      console.error('Error generating blog content:', err);
      toast.error('Failed to generate blog content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateBlog = async (blogData: {
    title: string;
    content: string;
    summary: string;
    category: string;
    tags: string[];
    coverImage: string;
    status: 'draft' | 'published';
    seoKeywords?: string[];
    structure?: string[];
  }) => {
    if (!user) return;
    
    try {
      const blogRef = await addDoc(collection(db, 'blogs'), {
        ...blogData,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
        likes: 0,
        comments: 0
      });
      
      // Update user's blogs array
      const updatedBlogs = [...(adminData?.blogs || []), {
        id: blogRef.id,
        ...blogData,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
        likes: 0,
        comments: 0
      }];

      await updateDoc(doc(db, 'users', user.uid), {
        blogs: updatedBlogs
      });

      setAdminData(prev => prev ? { ...prev, blogs: updatedBlogs } : null);
      await fetchStats();
      setShowCreateBlogModal(false);
      toast.success('Blog created successfully!');
    } catch (err) {
      console.error('Error creating blog:', err);
      toast.error('Failed to create blog');
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

  const handleEditEvent = async (eventData: any) => {
    try {
      setLoading(true);
      const eventRef = doc(db, 'events', eventData.id);
      
      // Update the event document
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: Timestamp.now()
      });

      // Update the registrations/_info document
      const registrationsInfoRef = doc(db, 'events', eventData.id, 'registrations', '_info');
      await updateDoc(registrationsInfoRef, {
        lastUpdated: new Date(),
        registrationConfig: {
          requirePayment: !!eventData.registrationFee,
          paymentAmount: eventData.registrationFee,
          paymentInstructions: eventData.paymentInstructions,
          upiId: eventData.upiId,
          organizerPhone: eventData.organizerPhone
        }
      });

      await fetchStats();
      toast.success('Event updated successfully!');
    } catch (err: any) {
      console.error('Error updating event:', err);
      toast.error(err.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const eventRef = doc(db, 'events', eventId);
      
      // Delete the event document
      await deleteDoc(eventRef);
      
      // Delete the registrations subcollection
      const registrationsRef = collection(db, 'events', eventId, 'registrations');
      const registrationsSnapshot = await getDocs(registrationsRef);
      const deletePromises = registrationsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      await fetchStats();
      toast.success('Event deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting event:', err);
      toast.error(err.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  // Add products management functions
  const createSampleProducts = async () => {
    try {
      const sampleProducts = [
        {
          name: "Pro Gaming Mouse",
          description: "High-precision gaming mouse with RGB lighting and programmable buttons",
          price: 79.99,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=1000",
          category: "mouse",
          brand: "GameTech",
          rating: 4.5,
          stock: 50,
          features: ["16000 DPI", "RGB Lighting", "8 Programmable Buttons"],
          specifications: {
            "Sensor": "Optical",
            "Connection": "USB Wired",
            "Weight": "95g"
          },
          isFeatured: true
        },
        {
          name: "Mechanical Gaming Keyboard",
          description: "RGB mechanical keyboard with custom switches for the ultimate gaming experience",
          price: 129.99,
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000",
          category: "keyboard",
          brand: "GameTech",
          rating: 4.8,
          stock: 30,
          features: ["Mechanical Switches", "RGB Per-Key Lighting", "Aluminum Frame"],
          specifications: {
            "Switch Type": "Blue",
            "Layout": "Full Size",
            "Backlight": "RGB"
          },
          isFeatured: true
        },
        {
          name: "Gaming Headset Pro",
          description: "Premium gaming headset with 7.1 surround sound and noise-canceling mic",
          price: 149.99,
          image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000",
          category: "headset",
          brand: "AudioTech",
          rating: 4.7,
          stock: 25,
          features: ["7.1 Surround Sound", "Noise-Canceling Mic", "Memory Foam Earpads"],
          specifications: {
            "Driver": "50mm",
            "Frequency Response": "20Hz-20kHz",
            "Connection": "USB/3.5mm"
          },
          isFeatured: true
        }
      ];

      console.log('Creating sample products...');
      for (const product of sampleProducts) {
        const now = Timestamp.now();
        await addDoc(collection(db, 'products'), {
          ...product,
          createdAt: now,
          updatedAt: now
        });
      }
      console.log('Sample products created successfully');
    } catch (error) {
      console.error('Error creating sample products:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      console.log('Fetching products from Firestore...');
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      console.log('Fetched products:', productsData);
      
      if (productsData.length === 0) {
        console.log('No products found, creating samples...');
        await createSampleProducts();
        // Fetch products again after creating samples
        const newSnapshot = await getDocs(productsCollection);
        const newProductsData = newSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(newProductsData);
      } else {
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const productsCollection = collection(db, 'products');
      const now = Timestamp.now();
      await addDoc(productsCollection, {
        ...productData,
        createdAt: now,
        updatedAt: now
      });
      toast.success('Product created successfully!');
      await fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', productId));
      toast.success('Product deleted successfully!');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = async (productData: Product) => {
    try {
      const productRef = doc(db, 'products', productData.id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: Timestamp.now()
      });
      toast.success('Product updated successfully!');
      await fetchProducts();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormState) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrevStateChange = (prev: FormState): FormState => ({
    ...prev,
  });

  const handleEventPrevStateChange = (prev: EventData[]): EventData[] => [...prev];

  const calculateTotalRevenue = (events: EventData[]): number => {
    return events.reduce((acc: number, event: EventData) => acc + event.price, 0);
  };

  const handleEventDelete = (event: EventData): void => {
    // ... existing code ...
  };

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
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
      {/* Header/Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Left side - Navigation Links */}
            <nav className="flex items-center space-x-8">
              <a href="/" className="text-white hover:text-indigo-400 transition-colors">Home</a>
              <a href="/about" className="text-white hover:text-indigo-400 transition-colors">About</a>
              <a href="/services" className="text-white hover:text-indigo-400 transition-colors">Services</a>
              <a href="/portfolio" className="text-white hover:text-indigo-400 transition-colors">Portfolio</a>
              <a href="/products" className="text-indigo-400">Products</a>
            </nav>

            {/* Right side - Cart and Profile */}
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative p-2 text-white hover:text-indigo-400 transition-colors"
                title="View Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </div>
                )}
              </motion.button>
              <button className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors">
                <User className="w-6 h-6" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
            onClick={() => handleTabChange('dashboard')}
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
            onClick={() => handleTabChange('events')}
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
            onClick={() => handleTabChange('jobs')}
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
            onClick={() => handleTabChange('settings')}
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
            onClick={() => handleTabChange('nft-rewards')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'nft-rewards' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Medal className="w-5 h-5" />
            <span>NFT Rewards</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
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
            {activeTab === 'products' && 'Products'}
            {activeTab === 'orders' && 'Orders'}
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
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Events</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{events.length}</h3>
                  </div>
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Registrations</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {events.reduce((acc, event) => acc + (event.registrations?.length || 0), 0)}
                    </h3>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Events</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {events.filter(event => event.status === 'Registration Open').length}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <BarChart className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Events Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
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

              {eventsLoading ? (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="mt-2 text-gray-400">Loading events...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-white">No events yet</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Get started by creating your first event.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events
                    .filter(event => event.status !== 'Completed')
                    .sort((a, b) => b.date.toMillis() - a.date.toMillis())
                    .slice(0, 6)
                    .map((event) => (
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
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center text-gray-300">
                              <Gamepad2 className="w-5 h-5 mr-2 text-indigo-400" />
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
                              {format(event.date.toDate(), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center text-gray-300">
                              <MapPin className="w-5 h-5 mr-2 text-indigo-400" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-gray-300">
                              <Users className="w-5 h-5 mr-2 text-indigo-400" />
                              {event.registrations?.length || 0}/{event.capacity} teams
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedEvent(event)}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit Event
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteEvent(event.id)}
                              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>

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
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">All Events</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminData.events && adminData.events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {format(event.date.toDate(), 'MMM dd, yyyy')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{event.creatorEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {event.registrations?.length || 0} / {event.capacity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

        {/* Products View */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Products</h2>
                <p className="text-gray-400 text-sm mt-1">Manage your product catalog</p>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCart(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white rounded-lg hover:bg-gray-700/50 transition-colors relative"
                  title="View Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </div>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateProductModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </motion.button>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <p className="mt-2 text-gray-400">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-white">No products yet</h3>
                <p className="mt-1 text-sm text-gray-400">
                  Get started by adding your first product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-white">${product.price}</span>
                      <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                          product.stock > 0
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Cart Modal */}
            {showCart && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Shopping Cart</h3>
                    <button
                      onClick={() => setShowCart(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="mt-2 text-gray-400">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {cart.map(({ product, quantity }) => (
                          <div key={product.id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="text-white font-medium">{product.name}</h4>
                                <p className="text-gray-400">${product.price}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    if (quantity > 1) {
                                      setCart(prevCart =>
                                        prevCart.map(item =>
                                          item.product.id === product.id
                                            ? { ...item, quantity: item.quantity - 1 }
                                            : item
                                        )
                                      );
                                    } else {
                                      setCart(prevCart =>
                                        prevCart.filter(item => item.product.id !== product.id)
                                      );
                                    }
                                  }}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-white w-8 text-center">{quantity}</span>
                                <button
                                  onClick={() => {
                                    if (quantity < product.stock) {
                                      setCart(prevCart =>
                                        prevCart.map(item =>
                                          item.product.id === product.id
                                            ? { ...item, quantity: item.quantity + 1 }
                                            : item
                                        )
                                      );
                                    }
                                  }}
                                  className="text-gray-400 hover:text-white"
                                  disabled={quantity >= product.stock}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  setCart(prevCart =>
                                    prevCart.filter(item => item.product.id !== product.id)
                                  );
                                }}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between text-white mb-4">
                          <span className="text-lg">Total:</span>
                          <span className="text-2xl font-bold">
                            ${cart.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0).toFixed(2)}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          <span>Checkout</span>
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Orders View */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">All Orders</h2>
              <p className="text-gray-400 text-sm mt-1">Manage and track customer orders</p>
            </div>

            {ordersLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <p className="mt-2 text-gray-400">Loading orders...</p>
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-white">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-400">Orders will appear here when customers make purchases.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-800/50 rounded-xl p-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-400">
                          {order.createdAt instanceof Timestamp 
                            ? order.createdAt.toDate().toLocaleDateString()
                            : 'Date not available'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''
                      }`}>
                        Completed
                      </span>
                    </div>

                    {/* Order Content */}
                    <div className="grid grid-cols-2 gap-8">
                      {/* Items Section */}
                      <div>
                        <h4 className="text-sm text-gray-400 mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items && order.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <p className="text-white text-sm">{item.name}</p>
                                <p className="text-gray-400 text-sm">${item.price} × {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div>
                        <h4 className="text-sm text-gray-400 mb-3">Payment Details</h4>
                        <div className="space-y-2">
                          <p className="text-white">Total: ${order.totalAmount?.toFixed(2) || '0.00'}</p>
                          <p className="text-gray-400">Method: {order.paymentMethod}</p>
                          {order.transactionHash && (
                            <a
                              href={`https://sepolia.basescan.org/tx/${order.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 text-sm"
                            >
                              <span>View Transaction</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
      <CreateBlogModal
        isOpen={showCreateBlogModal}
        onClose={() => setShowCreateBlogModal(false)}
        onSubmit={handleCreateBlog}
      />

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

      {/* Edit Event Modal */}
      {selectedEvent && (
        <EditEventModal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          onSubmit={handleEditEvent}
          eventData={selectedEvent}
        />
      )}

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
        onSubmit={handleCreateProduct}
      />

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmit={handleEditProduct}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

const CreateProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData((prevState: FormState) => {
      const newFeatures = [...prevState.features];
      newFeatures[index] = value;
      return {
        ...prevState,
        features: newFeatures
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 space-y-6">
        <h3 className="text-xl font-bold text-white">Create New Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... rest of the form content ... */}
        </form>
      </div>
    </div>
  );
};

const EditProductModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: Product) => Promise<void>;
  product: Product;
}> = ({ isOpen, onClose, onSubmit, product }) => {
  const [formData, setFormData] = useState(product);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 space-y-6">
        <h3 className="text-xl font-bold text-white">Edit Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-gray-400">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm text-gray-400">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm text-gray-400">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm text-gray-400">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm text-gray-400">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm text-gray-400">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
              required
            >
              <option value="keyboard">Keyboard</option>
              <option value="mouse">Mouse</option>
              <option value="headset">Headset</option>
              <option value="monitor">Monitor</option>
              <option value="accessories">Accessories</option>
              <option value="chair">Chair</option>
              <option value="desk">Desk</option>
              <option value="controller">Controller</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile; 