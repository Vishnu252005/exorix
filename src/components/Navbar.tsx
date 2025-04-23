import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, UserCircle, LogOut, Bell, User, ChevronDown, ChevronUp, MessageSquare, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import ProfileAvatar from './ProfileAvatar';
import ExorixLogo from '../assets/exorix-logo.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { user, loading, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'Esports', path: '/esports' },
    { name: 'Base Track', path: '/base' },
    { name: 'Monad', path: '/monad' },
    { name: 'Join Us', path: '/join' },
    { name: 'Contact', path: '/contact' },
  ];

  // Profile menu items
  const profileMenuItems = [
    { name: 'My Profile', path: '/profile' },
    { name: 'Dashboard', path: '/profile' },
    { name: 'Settings', path: '/profile' },
  ];

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const profileMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -5,
      transition: { 
        duration: 0.15,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  const renderProfileMenu = () => (
    <AnimatePresence>
      {showProfileMenu && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={profileMenuVariants}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
        >
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowProfileMenu(false)}
          >
            My Profile
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowProfileMenu(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setShowProfileMenu(false)}
          >
            Settings
          </Link>
          <hr className="my-1 border-gray-200 dark:border-gray-700" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const CartModal = () => (
    <AnimatePresence>
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setShowCart(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-4 top-20 w-96 max-h-[80vh] overflow-auto bg-gray-900 rounded-xl shadow-xl border border-gray-800/50"
          >
            <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Shopping Cart ({totalItems})</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Your cart is empty</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowCart(false);
                    navigate('/products');
                  }}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Products
                </motion.button>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400">${item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            className="p-1 hover:bg-gray-800/50 rounded"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </button>
                          <span className="text-gray-300">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-gray-800/50 rounded"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <button 
                        className="p-2 hover:bg-gray-800/50 rounded-lg"
                        aria-label="Remove item from cart"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Total</span>
                    <span className="text-xl font-bold text-white">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCart(false);
                      navigate('/checkout');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium"
                  >
                    Checkout
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Loading state
  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Exorix</span>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                  whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
                >
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <img src={ExorixLogo} alt="Exorix" className="relative h-10 w-auto" />
              </motion.div>
              </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item, index) => (
                    <Link
                  key={item.path}
                      to={item.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-indigo-400'
                      : 'text-gray-300 hover:text-indigo-400'
                  }`}
                      >
                        {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeNavLink"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                      initial={false}
                    />
                  )}
                    </Link>
              ))}

              {/* Social Media Icons */}
              <div className="flex items-center space-x-2">
                <Link
                  to="/chat"
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                  aria-label="Community Chat"
                >
                  <MessageSquare className="w-5 h-5 text-gray-300" />
                </Link>

                <motion.a
                  href="https://www.youtube.com/@exorixx"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                  aria-label="Subscribe to our YouTube"
                >
                  <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>

                <motion.a
                  href="https://www.twitch.tv/exorix25"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                  aria-label="Follow us on Twitch"
                >
                  <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                </motion.a>

                <motion.a
                  href="https://discord.gg/exorix"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                  aria-label="Join our Discord"
                >
                  <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1 .008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1 .006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
                {/* Cart Icon */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCart(!showCart)}
                  className="relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-300" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium text-white bg-indigo-600 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </motion.button>

                {user ? (
                  <div className="relative">
                  <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    aria-label="User profile"
                  >
                    <User className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm text-gray-300">Profile</span>
                    {showProfileMenu ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>

                    {renderProfileMenu()}
                  </div>
                ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors"
                  >
                    Sign In
                  </Link>
                    <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                    Sign Up
                    </Link>
                </>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      <CartModal />
    </>
  );
};

export default Navbar;