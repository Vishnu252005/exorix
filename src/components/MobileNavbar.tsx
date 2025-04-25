import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiShoppingBag, HiUser, HiHeart, HiShoppingCart } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const MobileNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const navItems = [
    { path: '/', icon: HiHome, label: 'Home' },
    { path: '/products', icon: HiShoppingBag, label: 'Shop' },
    { path: '/wishlist', icon: HiHeart, label: 'Wishlist', count: wishlist.length },
    { path: '/cart', icon: HiShoppingCart, label: 'Cart', count: cart.length },
    { path: user ? '/profile' : '/login', icon: HiUser, label: user ? 'Profile' : 'Login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden z-50">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center py-2 relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center ${
                  isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
                {item.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar; 