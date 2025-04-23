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
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
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
}

const PRODUCTS: Product[] = [
  // Featured Products
  {
    id: '1',
    name: 'Exorix Pro Gaming Keyboard',
    description: 'Mechanical RGB gaming keyboard with Cherry MX switches, customizable backlighting, and macro keys.',
    price: 149.99,
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
    }
  },
  {
    id: '2',
    name: 'Exorix Precision Gaming Mouse',
    description: 'High-precision gaming mouse with 16K DPI sensor, customizable weights, and RGB lighting.',
    price: 79.99,
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
    }
  },
  // New Featured Products
  {
    id: '5',
    name: 'Exorix Elite Gaming Chair',
    description: 'Premium gaming chair with 4D armrests, lumbar support, and memory foam cushions.',
    price: 299.99,
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
    }
  },
  {
    id: '6',
    name: 'Exorix Battle Station Gaming Desk',
    description: 'Professional gaming desk with RGB lighting, cable management, and ergonomic design.',
    price: 399.99,
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
    }
  },
  // Regular Products
  {
    id: '4',
    name: 'Exorix Vision Gaming Monitor',
    description: '27" 1440p gaming monitor with 165Hz refresh rate, 1ms response time, and G-Sync compatibility.',
    price: 399.99,
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
    }
  },
  // New Regular Products
  {
    id: '7',
    name: 'Exorix Pro Controller',
    description: 'Wireless gaming controller with customizable buttons, RGB lighting, and motion controls.',
    price: 89.99,
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
    }
  },
  {
    id: '8',
    name: 'Exorix RGB Mouse Pad',
    description: 'Large RGB gaming mouse pad with non-slip base and smooth tracking surface.',
    price: 29.99,
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
    }
  },
  {
    id: '9',
    name: 'Exorix Gaming Headset Stand',
    description: 'RGB headset stand with USB hub and wireless charging pad.',
    price: 49.99,
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
    }
  },
  {
    id: '10',
    name: 'Exorix Gaming Speakers',
    description: '2.1 gaming speakers with RGB lighting and deep bass.',
    price: 129.99,
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
    }
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showQuickView, setShowQuickView] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isNotifying, setIsNotifying] = useState<Set<string>>(new Set());
  const [showFeatured, setShowFeatured] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { addToCart } = useCart();

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      let q = query(productsCollection);

      // Apply filters
      if (selectedCategory) {
        q = query(q, where('category', '==', selectedCategory));
      }

      if (sortBy === 'price-asc') {
        q = query(q, orderBy('price', 'asc'));
      } else if (sortBy === 'price-desc') {
        q = query(q, orderBy('price', 'desc'));
      } else if (sortBy === 'rating') {
        q = query(q, orderBy('rating', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Apply search filter
      let filteredProducts = fetchedProducts;
      if (searchQuery) {
        filteredProducts = fetchedProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply price range filter
      filteredProducts = filteredProducts.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Sort by featured if needed
      if (sortBy === 'featured') {
        filteredProducts.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery, priceRange]);

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

  const handleNotifyMe = (productId: string) => {
    setIsNotifying(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        toast.success('Notification cancelled');
      } else {
        next.add(productId);
        toast.success('You will be notified when this product is back in stock');
      }
      return next;
    });
  };

  const shareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesFeatured = !showFeatured || product.isFeatured;
    return matchesCategory && matchesSearch && matchesPrice && matchesFeatured;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return b.rating - a.rating;
  });

  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingCart },
    { id: 'keyboard', name: 'Keyboards', icon: Keyboard },
    { id: 'mouse', name: 'Mice', icon: Mouse },
    { id: 'headset', name: 'Headsets', icon: Headphones },
    { id: 'monitor', name: 'Monitors', icon: Monitor }
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
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
      product.variants?.[0] || null
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 max-w-4xl w-full border border-gray-700/50"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="ml-1">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-400">{product.brand}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
              aria-label="Close product details"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={selectedVariant?.images?.[0] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.variants && (
                <div className="grid grid-cols-4 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-indigo-500'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={variant.images[0]}
                        alt={`${product.name} variant`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-3xl font-bold text-white">
                    ${selectedVariant?.price || product.price}
                  </span>
                  {product.stock > 0 ? (
                    <p className="text-green-400 text-sm">In Stock</p>
                  ) : (
                    <p className="text-red-400 text-sm">Out of Stock</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToggleWishlist(product.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      wishlist.includes(product.id)
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                    aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onShare}
                    className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
                    aria-label="Share product"
                  >
                    <Share2 className="w-5 h-5 text-gray-300" />
                  </motion.button>
                </div>
              </div>

              <div className="flex space-x-2 border-b border-gray-700">
                {(['details', 'specs', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-indigo-400 border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p className="text-gray-300">{product.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-white">Key Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-gray-300">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <dt className="text-sm text-gray-400">{key}</dt>
                        <dd className="text-white">{value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {product.reviews?.map((review) => (
                    <div key={review.id} className="border-b border-gray-700 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{review.user}</span>
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                      <span className="text-sm text-gray-400">
                        {review.date.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                disabled={!product.stock}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </motion.button>
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

  const ProductCard = ({ product }: { product: Product }) => {
    const handleAddToCart = () => {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    };

    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -10 }}
        className="group relative bg-[#0F1115] rounded-2xl border border-gray-800/50 overflow-hidden transition-all duration-300 hover:border-indigo-500/50 h-full"
    >
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0D0F14]">
          <motion.img
          src={product.image}
          alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-indigo-600/80 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-indigo-600/80 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </motion.button>
          </div>
          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-red-500/80 backdrop-blur-sm text-white text-sm font-medium">
              Out of Stock
        </div>
          )}
        </div>

        {/* Product Info */}
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
              <p className="text-sm text-gray-500">{product.brand}</p>
          </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
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
      <div className="flex-1 p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchBar
                value={searchQuery}
            onChange={handleSearchChange}
            onSearch={handleSearchChange}
              />
          <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
              <Filter size={20} />
              Filters
              </button>
              <select
                value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                aria-label="Sort products by"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        {showFilters && (
          <div className="mb-6 grid gap-6 rounded-lg border border-gray-200 bg-white p-6 md:grid-cols-3">
            <div>
              <h3 className="mb-3 font-medium">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    selectedCategory === null ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {['keyboard', 'mouse', 'headset', 'monitor', 'accessories', 'chair', 'desk', 'controller'].map(
                  (category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                        selectedCategory === category ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">${priceRange[0]}</span>
                  <span className="text-sm text-gray-600">${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                  aria-label="Maximum price range"
                />
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-gray-500">
              <RotateCw className="animate-spin" />
              Loading products...
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-xl">{error}</div>
                <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
                </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Hero Banner */}
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

      {/* Featured Categories */}
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
                onClick={() => setSelectedCategory(category.toLowerCase())}
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

      {/* Best Sellers */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Best Sellers</h2>
              <p className="text-gray-400">Our most popular gaming gear</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.rating >= 4.8)
              .slice(0, 4)
              .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          </div>
        </div>
      </div>

      {/* Latest Deals */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.slice(0, 3).map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -10 }}
                className="group bg-gray-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-colors"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Save 20%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-white">${product.price}</span>
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        ${(product.price * 1.2).toFixed(2)}
            </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <ProductsSection />

      {/* Newsletter Section */}
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

      {/* Modals */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onShare={() => shareProduct(selectedProduct)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products; 