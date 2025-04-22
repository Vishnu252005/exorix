import React, { useState, useRef, Suspense } from 'react';
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
  Bell
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { toast } from 'react-hot-toast';

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
  category: 'keyboard' | 'mouse' | 'headset' | 'monitor' | 'accessories';
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
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Stellar Pro Gaming Keyboard',
    description: 'Mechanical RGB gaming keyboard with Cherry MX switches, customizable backlighting, and macro keys.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80',
    category: 'keyboard',
    brand: 'Stellar Gaming',
    rating: 4.8,
    stock: 50,
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
    name: 'Stellar Precision Gaming Mouse',
    description: 'High-precision gaming mouse with 16K DPI sensor, customizable weights, and RGB lighting.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80',
    category: 'mouse',
    brand: 'Stellar Gaming',
    rating: 4.9,
    stock: 75,
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
  {
    id: '3',
    name: 'Stellar Immerse Gaming Headset',
    description: '7.1 surround sound gaming headset with noise-cancelling mic and memory foam ear cushions.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80',
    category: 'headset',
    brand: 'Stellar Gaming',
    rating: 4.7,
    stock: 60,
    features: [
      '7.1 Surround Sound',
      'Detachable noise-cancelling mic',
      'Memory foam ear cushions',
      'RGB lighting',
      'Cross-platform compatibility'
    ],
    specifications: {
      'Audio': '7.1 Surround Sound',
      'Driver Size': '50mm',
      'Frequency Response': '20Hz - 20kHz',
      'Microphone': 'Detachable',
      'Connection': '3.5mm / USB'
    }
  },
  {
    id: '4',
    name: 'Stellar Vision Gaming Monitor',
    description: '27" 1440p gaming monitor with 165Hz refresh rate, 1ms response time, and G-Sync compatibility.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?auto=format&fit=crop&q=80',
    category: 'monitor',
    brand: 'Stellar Gaming',
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
  }
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showQuickView, setShowQuickView] = useState<string | null>(null);
  const [show3DView, setShow3DView] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isNotifying, setIsNotifying] = useState<Set<string>>(new Set());

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
    return matchesCategory && matchesSearch && matchesPrice;
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
    const [show3D, setShow3D] = useState(false);

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
                {show3D && product.model3D ? (
                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RotateCw className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  }>
                    <Canvas>
                      <Stage environment="city" intensity={0.6}>
                        <OrbitControls enableZoom={true} autoRotate />
                        {/* 3D model would be loaded here */}
                      </Stage>
                    </Canvas>
                  </Suspense>
                ) : (
                  <img
                    src={selectedVariant?.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {product.model3D && (
                  <button
                    onClick={() => setShow3D(!show3D)}
                    className="absolute bottom-4 right-4 p-2 bg-gray-900/80 rounded-lg hover:bg-gray-800/80 transition-colors"
                    aria-label="Toggle 3D view"
                  >
                    <Cube className="w-5 h-5 text-gray-300" />
                  </button>
                )}
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

  const ProductCard = ({ product }: { product: Product }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickView(product.id);
            }}
            className="p-2 bg-gray-900/80 rounded-full hover:bg-gray-800/80 transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-5 h-5 text-gray-300" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full transition-colors ${
              wishlist.includes(product.id)
                ? 'bg-pink-600 text-white'
                : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/80'
            }`}
            aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          {product.model3D && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShow3DView(true)}
              className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
              aria-label="View 3D model"
            >
              <Cube className="w-5 h-5 text-gray-300" />
            </motion.button>
          )}
        </div>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-white">${product.price}</span>
          <div className="flex items-center text-yellow-400">
            <Star className="w-5 h-5 fill-current" />
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {product.stock > 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              onClick={() => setSelectedProduct(product)}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNotifyMe(product.id)}
              className="flex-1 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-colors flex items-center justify-center space-x-2"
            >
              <Bell className="w-5 h-5" />
              <span>{isNotifying.has(product.id) ? 'Cancel Notification' : 'Notify Me'}</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => shareProduct(product)}
            className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5 text-gray-300" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-24">
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 to-purple-900/20" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Premium Gaming Gear
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Level up your gaming setup with our premium selection of gaming peripherals and accessories.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                aria-label="Sort products by"
                title="Sort products"
              >
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <QuickViewModal
            productId={showQuickView}
            onClose={() => setShowQuickView(null)}
          />
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
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