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
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'Esports', path: '/esports' },
    { name: 'NFT', path: '/monad' },
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

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
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
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/80 backdrop-blur-xl shadow-[0_0_30px_rgba(79,70,229,0.1)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with glow effect */}
            <Link to="/" className="flex items-center space-x-2 group relative">
              <motion.div
                  whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
                >
                <motion.div
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition duration-500"
                />
                <img src={ExorixLogo} alt="Exorix" className="relative h-10 w-auto" />
              </motion.div>
              </Link>

            {/* Desktop Navigation with hover effects and animations */}
            <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  custom={index}
                  variants={menuItemVariants}
                >
                  <Link
                      to={item.path}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                        ? 'text-white bg-indigo-600/10'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                      >
                    <span className="relative z-10">{item.name}</span>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeNavLink"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg"
                      initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                    </Link>
                </motion.div>
              ))}
            </div>

            {/* Social Media Icons with hover effects */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Chat Icon */}
                <Link
                  to="/chat"
                className="group relative p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <motion.div
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"
                  />
                  <MessageSquare className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </motion.div>
                </Link>

              {/* Cart Icon with enhanced animation */}
                <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCart(!showCart)}
                className="group relative p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
              >
                <motion.div
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"
                />
                <ShoppingCart className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                  {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  >
                      {totalItems}
                  </motion.span>
                  )}
                </motion.button>

              {/* Auth Section */}
                {user ? (
                  <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 group"
                  >
                    <User className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Profile</span>
                    <motion.div
                      animate={{ rotate: showProfileMenu ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.div>
                  </motion.button>

                    {renderProfileMenu()}
                  </div>
                ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                    to="/signup"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-600/20"
                    >
                    Sign Up
                    </Link>
                  </motion.div>
                </div>
                )}
            </div>

            {/* Mobile menu button with animation */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-300" />
                )}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile menu with improved animation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                className="md:hidden overflow-hidden bg-gray-900/90 backdrop-blur-xl rounded-b-2xl border-t border-gray-800/50"
              >
                <div className="px-4 py-6 space-y-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      custom={index}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        to={item.path}
                        className={`block px-4 py-2 text-base font-medium rounded-lg transition-all duration-300 ${
                          location.pathname === item.path
                            ? 'text-white bg-indigo-600/10'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  {!user && (
                    <div className="pt-4 space-y-3">
                      <Link
                        to="/signin"
                        className="block w-full px-4 py-2 text-center text-base font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full px-4 py-2 text-center text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
      <CartModal />
    </>
  );
};

export default Navbar;