import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard,
  Mouse,
  Headphones,
  Monitor,
  Filter,
  Search,
  ShoppingCart,
  Star,
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
  Info,
  Heart,
  Share2,
  Eye,
  Cube,
  MessageSquare,
  RotateCw,
  Bell,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import debounce from 'lodash/debounce';
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Product } from '@/data/products';
import { useCart } from "../context/CartContext";

interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  price: number;
  stock: number;
  images: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: 'keyboard' | 'mouse' | 'headset' | 'monitor' | 'accessories' | 'chair' | 'desk' | 'controller';
  brand: string;
  rating: number;
  stock: number;
  features: string[];
  specifications: Record<string, string>;
  variants?: ProductVariant[];
  model3D?: string;
  reviews?: {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
  relatedProducts?: string[];
  isFeatured?: boolean;
  inStock: boolean;
  tags: string[];
}

const PRODUCTS: Product[] = [
  // Featured Products
  {
    id: '1',
    name: 'Exorix Pro Gaming Keyboard',
    description: 'Mechanical RGB gaming keyboard with Cherry MX switches, customizable backlighting, and macro keys.',
    price: 149.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&q=80',
    category: 'keyboard',
    brand: 'Exorix Gaming',
    rating: 4.8,
    stock: 50,
    isFeatured: true,
    features: [
      'Cherry MX Blue Switches',
      'Per-key RGB lighting',
      'Aircraft-grade aluminum frame',
      'Detachable wrist rest',
      'USB pass-through port'
    ],
    specifications: {
      'Switch Type': 'Mechanical (Cherry MX Blue)',
      'Backlighting': 'RGB (16.8M colors)',
      'Connection': 'USB-C',
      'Dimensions': '17.5 x 5.5 x 1.4 inches',
      'Weight': '2.5 lbs'
    },
    inStock: true,
    tags: ['mechanical', 'rgb', 'gaming']
  },
  {
    id: '2',
    name: 'Exorix Precision Gaming Mouse',
    description: 'High-precision gaming mouse with 16K DPI sensor, customizable weights, and RGB lighting.',
    price: 79.99,
    originalPrice: 95.99,
    image: 'https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&q=80',
    category: 'mouse',
    brand: 'Exorix Gaming',
    rating: 4.9,
    stock: 75,
    isFeatured: true,
    features: [
      '16,000 DPI optical sensor',
      '8 programmable buttons',
      'Adjustable weights',
      'RGB lighting zones',
      'On-board memory profiles'
    ],
    specifications: {
      'Sensor': 'Optical (16K DPI)',
      'Buttons': '8 programmable',
      'Connection': 'USB / 2.4GHz Wireless',
      'Battery Life': '60 hours',
      'Weight': '95g (adjustable)'
    },
    inStock: true,
    tags: ['wireless', 'rgb', 'gaming']
  },
  // New Featured Products
  {
    id: '5',
    name: 'Exorix Elite Gaming Chair',
    description: 'Premium gaming chair with 4D armrests, lumbar support, and memory foam cushions.',
    price: 299.99,
    originalPrice: 359.99,
    image: 'https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&q=80',
    category: 'chair',
    brand: 'Exorix Gaming',
    rating: 4.9,
    stock: 25,
    isFeatured: true,
    features: [
      '4D Adjustable Armrests',
      'Memory Foam Cushions',
      'Lumbar Support',
      'Reclining Backrest',
      'Premium PU Leather'
    ],
    specifications: {
      'Material': 'Premium PU Leather',
      'Weight Capacity': '330 lbs',
      'Height': 'Adjustable 17.7" - 21.7"',
      'Recline': '90° - 180°',
      'Warranty': '5 Years'
    },
    inStock: true,
    tags: ['ergonomic', 'premium', 'comfort']
  },
  {
    id: '6',
    name: 'Exorix Battle Station Gaming Desk',
    description: 'Professional gaming desk with RGB lighting, cable management, and ergonomic design.',
    price: 399.99,
    originalPrice: 499.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80',
    category: 'desk',
    brand: 'Exorix Gaming',
    rating: 4.8,
    stock: 15,
    isFeatured: true,
    features: [
      'RGB LED Lighting',
      'Built-in Cable Management',
      'Carbon Fiber Surface',
      'Height Adjustable',
      'Cup Holder & Headphone Hook'
    ],
    specifications: {
      'Dimensions': '63" x 31.5" x 29.5"',
      'Material': 'Carbon Fiber & Steel',
      'Weight Capacity': '220 lbs',
      'Height Range': '28" - 48"',
      'Warranty': '3 Years'
    },
    inStock: true,
    tags: ['gaming', 'rgb', 'ergonomic']
  },
  // Regular Products
  {
    id: '4',
    name: 'Exorix Vision Gaming Monitor',
    description: '27" 1440p gaming monitor with 165Hz refresh rate, 1ms response time, and G-Sync compatibility.',
    price: 399.99,
    originalPrice: 499.99,
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&q=80',
    category: 'monitor',
    brand: 'Exorix Gaming',
    rating: 4.9,
    stock: 30,
    features: [
      '27" QHD Display (2560x1440)',
      '165Hz Refresh Rate',
      '1ms Response Time',
      'G-Sync Compatible',
      'HDR400'
    ],
    specifications: {
      'Resolution': '2560x1440',
      'Panel Type': 'IPS',
      'Refresh Rate': '165Hz',
      'Response Time': '1ms GtG',
      'HDR': 'HDR400'
    },
    inStock: true,
    tags: ['gaming', 'monitor', 'hdr']
  },
  // New Regular Products
  {
    id: '7',
    name: 'Exorix Pro Controller',
    description: 'Wireless gaming controller with customizable buttons, RGB lighting, and motion controls.',
    price: 89.99,
    originalPrice: 109.99,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
    category: 'controller',
    brand: 'Exorix Gaming',
    rating: 4.6,
    stock: 45,
    features: [
      'Wireless Connectivity',
      'Customizable Buttons',
      'RGB Lighting',
      'Motion Controls',
      'Haptic Feedback'
    ],
    specifications: {
      'Battery Life': '20 hours',
      'Connection': 'Bluetooth 5.0',
      'Compatibility': 'PC, PS5, Xbox',
      'Weight': '250g',
      'Warranty': '2 Years'
    },
    inStock: true,
    tags: ['wireless', 'customizable', 'gaming']
  },
  {
    id: '8',
    name: 'Exorix RGB Mouse Pad',
    description: 'Large RGB gaming mouse pad with non-slip base and smooth tracking surface.',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1612538498456-e861df91d4d0?auto=format&fit=crop&q=80',
    category: 'accessories',
    brand: 'Exorix Gaming',
    rating: 4.5,
    stock: 100,
    features: [
      'RGB Edge Lighting',
      'Non-slip Rubber Base',
      'Smooth Tracking Surface',
      'Waterproof',
      'Stitched Edges'
    ],
    specifications: {
      'Size': '900 x 400 x 3mm',
      'Material': 'Micro-woven Cloth',
      'Connection': 'USB',
      'Compatibility': 'All Mice',
      'Warranty': '1 Year'
    },
    inStock: true,
    tags: ['gaming', 'rgb', 'accessories']
  },
  {
    id: '9',
    name: 'Exorix Gaming Headset Stand',
    description: 'RGB headset stand with USB hub and wireless charging pad.',
    price: 49.99,
    originalPrice: 59.99,
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80',
    category: 'accessories',
    brand: 'Exorix Gaming',
    rating: 4.7,
    stock: 35,
    features: [
      'RGB Lighting',
      'USB 3.0 Hub',
      'Wireless Charging',
      'Adjustable Height',
      'Cable Management'
    ],
    specifications: {
      'Height': 'Adjustable 8" - 12"',
      'USB Ports': '4 x USB 3.0',
      'Charging': 'Qi Wireless',
      'Material': 'Aluminum & Plastic',
      'Warranty': '1 Year'
    },
    inStock: true,
    tags: ['gaming', 'rgb', 'accessories']
  },
  {
    id: '10',
    name: 'Exorix Gaming Speakers',
    description: '2.1 gaming speakers with RGB lighting and deep bass.',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80',
    category: 'accessories',
    brand: 'Exorix Gaming',
    rating: 4.8,
    stock: 20,
    features: [
      '2.1 Channel System',
      'RGB Lighting',
      'Deep Bass',
      'Bluetooth 5.0',
      'Touch Controls'
    ],
    specifications: {
      'Power': '60W RMS',
      'Frequency': '20Hz - 20kHz',
      'Connection': 'Bluetooth 5.0 / 3.5mm',
      'Dimensions': 'Subwoofer: 8.3" x 10.2"',
      'Warranty': '2 Years'
    },
    inStock: true,
    tags: ['gaming', 'rgb', 'accessories']
  }
];

// Add these new product images
const PRODUCT_IMAGES = {
  keyboard: {
    featured: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80",
    category: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80",
    products: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a"
    ]
  },
  mouse: {
    featured: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80",
    category: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80",
    products: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
      "https://images.unsplash.com/photo-1586349906319-47f6e290f599"
    ]
  },
  headset: {
    featured: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80",
    category: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80",
    products: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90"
    ]
  },
  monitor: {
    featured: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884?auto=format&fit=crop&q=80",
    category: "https://images.unsplash.com/photo-1616763355603-9755a640a287?auto=format&fit=crop&q=80",
    products: [
      "https://images.unsplash.com/photo-1527219525722-f9767a7f2884",
      "https://images.unsplash.com/photo-1616763355603-9755a640a287",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2"
    ]
  },
  chair: {
    featured: "https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&q=80",
    category: "https://images.unsplash.com/photo-1598257006626-48b0c252070d?auto=format&fit=crop&q=80",
    products: [
      "https://images.unsplash.com/photo-1598257006626-48b0c252070d",
      "https://images.unsplash.com/photo-1611508192457-e69808ba2b22",
      "https://images.unsplash.com/photo-1603217101869-be6a2ef861dd"
    ]
  }
};

const SearchBar = ({ value, onChange, onSearch }: { 
  value: string; 
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    onChange(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:w-96">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search products..."
          value={value}
          onChange={handleChange}
          className="w-full pl-12 pr-24 py-3 bg-[#0D0F14] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-800/50"
          autoComplete="off"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute right-2 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          Search
        </motion.button>
      </div>
    </form>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [latestDeals, setLatestDeals] = useState<Product[]>([]);
  const { addToCart } = useCart();

  // Fetch products from Firestore
  const fetchProducts = async () => {
      setLoading(true);
    try {
      // Fetch all products
      const productsRef = collection(db, 'products');
      const productsSnapshot = await getDocs(productsRef);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);

      try {
        // Try to fetch best sellers with index
        const bestSellersQuery = query(
          productsRef,
          where('isFeatured', '==', true),
          orderBy('rating', 'desc'),
          limit(4)
        );
        const bestSellersSnapshot = await getDocs(bestSellersQuery);
        const bestSellersData = bestSellersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setBestSellers(bestSellersData);
      } catch (error: any) {
        // If index doesn't exist, fetch without sorting
        if (error.code === 'failed-precondition') {
          console.log('Creating index for best sellers...');
          const simpleQuery = query(
            productsRef,
            where('isFeatured', '==', true),
            limit(4)
          );
          const snapshot = await getDocs(simpleQuery);
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          // Sort in memory instead
          const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          setBestSellers(sorted);
        } else {
          throw error;
        }
      }

      try {
        // Try to fetch latest deals (showing most recent products)
        const latestDealsQuery = query(
          productsRef,
          orderBy('createdAt', 'desc'),
          limit(4)
        );
        const latestDealsSnapshot = await getDocs(latestDealsQuery);
        const latestDealsData = latestDealsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setLatestDeals(latestDealsData);
      } catch (error: any) {
        // If index doesn't exist, fetch without sorting
        if (error.code === 'failed-precondition') {
          console.log('Creating index for latest products...');
          // Just get all products and sort them in memory
          const snapshot = await getDocs(productsRef);
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          // Sort by createdAt in memory and take the latest 4
          const sorted = [...data].sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB.getTime() - dateA.getTime();
          }).slice(0, 4);
          setLatestDeals(sorted);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        toast.success('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        toast.success('Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success('Added to cart');
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'keyboard', name: 'Keyboards' },
    { id: 'mouse', name: 'Mice' },
    { id: 'controller', name: 'Controllers' },
    { id: 'chair', name: 'Gaming Chairs' },
    { id: 'headset', name: 'Headsets' },
    { id: 'monitor', name: 'Monitors' },
  ];

  const ProductDetailsModal = ({
    product,
    onClose,
    wishlist,
    onToggleWishlist,
    onShare
  }: {
    product: Product;
    onClose: () => void;
    wishlist: string[];
    onToggleWishlist: (id: string) => void;
    onShare: () => void;
  }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
    const [selectedImage, setSelectedImage] = useState<string>(product.image);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
      toast.success('Added to cart');
      onClose();
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0F1115] rounded-2xl p-6 max-w-4xl w-full border border-gray-800/50 relative"
        >
            <button
              onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              aria-label="Close product details"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-[#0D0F14]">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[product.image, ...product.features.slice(0, 3).map((_, i) => product.image)].map((img, index) => (
                    <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === img ? 'border-indigo-500' : 'border-transparent'
                      }`}
                    >
                    <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm">
                    {product.category.toUpperCase()}
                  </span>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" /> {product.rating}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                <p className="text-gray-400">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 hover:text-indigo-400 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 hover:text-indigo-400 transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 ${
                      product.stock === 0
                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    } rounded-lg transition-all duration-300 font-medium`}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </motion.button>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onToggleWishlist(product.id)}
                    className={`flex-1 py-3 ${
                      wishlist.includes(product.id)
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    } rounded-lg transition-colors font-medium flex items-center justify-center gap-2`}
                  >
                    <Heart className={wishlist.includes(product.id) ? 'fill-current' : ''} size={20} />
                    {wishlist.includes(product.id) ? 'Added to Wishlist' : 'Add to Wishlist'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onShare}
                    className="p-3 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="border-t border-gray-800/50 pt-6">
                <div className="flex space-x-6 mb-6">
                {(['details', 'specs', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                      className={`relative px-2 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab
                          ? 'text-indigo-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                        />
                      )}
                  </button>
                ))}
              </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                      {product.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{feature}</span>
                            </div>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <dt className="text-sm text-gray-400">{key}</dt>
                        <dd className="text-white">{value}</dd>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                            <span className="text-2xl font-bold text-white">{product.rating}</span>
                            <span className="text-gray-400">out of 5</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {[
                            {
                              user: 'John Doe',
                              rating: 5,
                              comment: 'Excellent product! Exactly what I was looking for.',
                              date: '2 days ago'
                            },
                            {
                              user: 'Jane Smith',
                              rating: 4,
                              comment: 'Great quality but a bit pricey.',
                              date: '1 week ago'
                            }
                          ].map((review, index) => (
                            <div key={index} className="border-b border-gray-800/50 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{review.user}</span>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                  ))}
                        </div>
                      </div>
                              <p className="text-gray-300 mb-2">{review.comment}</p>
                              <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  ))}
                        </div>
                </div>
              )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const QuickViewModal = ({ productId, onClose }: { productId: string; onClose: () => void }) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 max-w-2xl w-full border border-gray-700/50"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">{product.name}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Close quick view"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">${product.price}</span>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-1">{product.rating}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    wishlist.includes(product.id)
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const ProductCard = ({ 
    product, 
    onProductSelect,
    onToggleWishlist,
    onQuickView,
    onAddToCart,
    wishlist 
  }: { 
    product: Product;
    onProductSelect: (product: Product) => void;
    onToggleWishlist: (id: string) => void;
    onQuickView: (id: string) => void;
    onAddToCart: (product: Product) => void;
    wishlist: string[];
  }) => {
    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -10 }}
        onClick={() => onProductSelect(product)}
        className="group relative bg-[#0F1115] rounded-2xl border border-gray-800/50 overflow-hidden transition-all duration-300 hover:border-indigo-500/50 h-full cursor-pointer"
    >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0D0F14]">
          <motion.img
          src={product.image}
          alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className="p-2.5 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-indigo-600/80 transition-colors"
            >
              <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product.id);
              }}
              className="p-2.5 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-indigo-600/80 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </motion.button>
          </div>
          {product.stock === 0 && (
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-red-500/80 backdrop-blur-sm text-white text-sm font-medium">
              Out of Stock
        </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-400">{product.category.toUpperCase()}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-amber-400">{product.rating}</span>
        </div>
      </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
            <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
        </div>

          <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
              <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
              )}
          </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
                disabled={product.stock === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  product.stock === 0 
                    ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                } transition-all duration-300`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
  };

  const ProductsSection = () => {
    const handleSearchChange = (value: string) => {
      setSearchQuery(value);
    };

    return (
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <SearchBar
                value={searchQuery}
            onChange={handleSearchChange}
            onSearch={handleSearchChange}
              />
          <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm rounded-xl text-gray-300 hover:bg-gray-700/80 transition-all duration-300"
              >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              </button>
              <select
                value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-800/80 backdrop-blur-sm rounded-xl text-gray-300 hover:bg-gray-700/80 transition-all duration-300 appearance-none cursor-pointer pr-10 min-w-[160px]"
                aria-label="Sort products by"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        <div className="mb-8 flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
                <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
              {category.name}
                </button>
          ))}
            </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index % 8 * 0.1
                  }}
                >
                  <ProductCard
                    product={product}
                    onProductSelect={setSelectedProduct}
                    onToggleWishlist={toggleWishlist}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={handleAddToCart}
                    wishlist={wishlist}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
              </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </motion.div>
          </div>
        )}

          {/* No more products indicator */}
          {!loading && products.length > 0 && (
                <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-400"
            >
              No more products to load
            </motion.div>
          )}

          {/* Empty state */}
          {products.length === 0 && !loading && (
            <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
                >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
          </div>
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 1000]);
                }}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
        )}
        </div>
      </div>
    );
  };

  if (loading) {
              return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover opacity-40"
          >
            <source src="https://player.vimeo.com/external/439548061.sd.mp4?s=730c78377a0d0e5b55411e163d6b447b1778cb6b&profile_id=164" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-pink-900/90" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <h1 className="text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Level Up Your Gaming Experience
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Premium gaming gear crafted for champions. Experience the next level of gaming with Exorix.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium"
            >
                Shop Collection
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-all duration-300 font-medium"
            >
                View Deals
            </motion.button>
            </div>
          </motion.div>
          </div>
        </div>

      <div className="py-16 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Categories</h2>
              <p className="text-gray-400">Browse our premium gaming gear collection</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-all duration-300"
            >
              View All Categories
            </motion.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Keyboard', 'Mouse', 'Headset'].map((category) => (
              <motion.div
                key={category}
                whileHover={{ y: -10 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedCategory(category.toLowerCase)}
              >
                <div className="aspect-[4/3]">
                  <img
                    src={PRODUCT_IMAGES[category.toLowerCase()].category}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category}</h3>
                    <p className="text-gray-300 mb-4">Premium {category.toLowerCase()} collection</p>
                    <span className="inline-flex items-center text-indigo-400 font-medium">
                      Shop Now
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                    </span>
        </div>
      </div>
    </motion.div>
            ))}
          </div>
            </div>
          </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Best Sellers</h2>
              <p className="text-gray-400">Our most popular gaming gear</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons for best sellers
              Array(4).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-[#0F1115] rounded-2xl p-4 animate-pulse">
                  <div className="w-full aspect-[4/3] bg-gray-800/50 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-800/50 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : bestSellers.length > 0 ? (
              bestSellers.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductSelect={setSelectedProduct}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={setQuickViewProduct}
                  onAddToCart={handleAddToCart}
                  wishlist={wishlist}
                />
              ))
            ) : (
              <div className="col-span-4 py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No featured products</h3>
                <p className="text-gray-400">Check back later for our best sellers!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Deals</h2>
              <p className="text-gray-400">Save big on premium gaming gear</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg hover:bg-gray-700/80 transition-all duration-300"
            >
              View All Deals
            </motion.button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeletons for latest deals
              Array(4).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-[#0F1115] rounded-2xl p-4 animate-pulse">
                  <div className="w-full aspect-[4/3] bg-gray-800/50 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-800/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-800/50 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : latestDeals.length > 0 ? (
              latestDeals.map(product => (
                <ProductCard
                key={product.id}
                  product={product}
                  onProductSelect={setSelectedProduct}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={setQuickViewProduct}
                  onAddToCart={handleAddToCart}
                  wishlist={wishlist}
                />
              ))
            ) : (
              <div className="col-span-4 py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                <h3 className="text-xl font-semibold text-white mb-2">No deals available</h3>
                <p className="text-gray-400">Check back later for new deals!</p>
                </div>
            )}
          </div>
        </div>
      </div>

      <ProductsSection />

      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"
            alt="Gaming Setup"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-pink-900/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Stay in the Game</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive deals, new product launches, and pro gaming tips.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-96 px-6 py-4 bg-gray-900/50 backdrop-blur-sm rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onShare={() => {}}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            productId={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products; 