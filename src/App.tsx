import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './web3Config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AnimatedLayout from './components/AnimatedLayout';
import BackgroundAnimation from './components/BackgroundAnimation';
import GradientMesh from './components/GradientMesh';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import preloadAssets from './utils/preloadAssets';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Products from './pages/Products';
import Contact from './pages/Contact';
import JoinUs from './pages/JoinUs';
import Esports from './pages/Esports';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Profile from './pages/Profile';
import AdminProfile from './pages/Profile/AdminProfile';
import AdminRoute from './components/AdminRoute';
import BaseTrackPage from './pages/BaseTrackPage';
import Monad from './pages/Monad';
import Chat from './pages/Chat';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from 'react-hot-toast';
import Checkout from './pages/Checkout';
import MobileNavbar from './components/MobileNavbar';

// Create a client
const queryClient = new QueryClient();

// Wrapper component to apply animations
const AnimatedRoutes = () => {
  const location = useLocation();
  const [backgroundType, setBackgroundType] = useState<string>('default');
  
  // Change background based on route
  useEffect(() => {
    // Set different background animations for different routes
    if (location.pathname === '/') {
      setBackgroundType('none');
    } else if (location.pathname.includes('/chat')) {
      setBackgroundType('gradient');
    } else if (location.pathname.includes('/about')) {
      setBackgroundType('gradientMesh');
    } else if (location.pathname.includes('/services')) {
      setBackgroundType('particles');
    } else if (location.pathname.includes('/portfolio') || location.pathname.includes('/blog')) {
      setBackgroundType('waves');
    } else if (location.pathname.includes('/esports')) {
      setBackgroundType('gradient');
    } else {
      setBackgroundType('default');
    }
  }, [location.pathname]);
  
  // Render the appropriate background based on the route
  const renderBackground = () => {
    switch (backgroundType) {
      case 'none':
        return null;
      case 'gradientMesh':
        return <GradientMesh />;
      case 'particles':
        return <BackgroundAnimation variant="particles" />;
      case 'waves':
        return <BackgroundAnimation variant="waves" />;
      case 'gradient':
        return <BackgroundAnimation variant="gradient" />;
      default:
        return <BackgroundAnimation variant="default" />;
    }
  };
  
  return (
    <>
      {renderBackground()}
      <AnimatedLayout>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/products" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/join" element={<JoinUs />} />
          <Route path="/esports" element={<Esports />} />
          <Route path="/base" element={<BaseTrackPage />} />
          <Route path="/monad" element={<Monad />} />
          <Route path="/chat" element={<Navigate to="/chat/general" replace />} />
          <Route path="/chat/:channelId" element={<Chat />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route 
            path="/admin/profile" 
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </AnimatedLayout>
    </>
  );
};

// Wrapper component to handle conditional footer rendering
const AppContent = () => {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat');
  const isProfilePage = location.pathname.includes('/profile') || location.pathname.includes('/admin/profile');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      <ScrollToTop />
      <Navbar />
      <AnimatedRoutes />
      {!isChatPage && !isProfilePage && <Footer />}
      <Chatbot />
      <MobileNavbar />
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  // Handle loading completion
  const finishLoading = async () => {
    try {
      await preloadAssets();
      setLoading(false);
    } catch (error) {
      console.error('Error during loading:', error);
      setLoading(false);
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
              <WishlistProvider>
          <Toaster position="top-center" />
              {loading ? (
                <LoadingScreen finishLoading={finishLoading} />
              ) : (
                <Router>
                  <AppContent />
                </Router>
              )}
              </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;