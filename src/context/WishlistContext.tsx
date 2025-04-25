import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { user } = useAuth();

  // Fetch wishlist when user changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        return;
      }

      try {
        const wishlistRef = doc(db, 'wishlists', user.uid);
        const wishlistDoc = await getDoc(wishlistRef);

        if (wishlistDoc.exists()) {
          setWishlist(wishlistDoc.data().items || []);
        } else {
          // Initialize empty wishlist for new users
          await setDoc(wishlistRef, { items: [] });
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist');
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist');
      return;
    }

    try {
      const wishlistRef = doc(db, 'wishlists', user.uid);
      const newWishlist = [...wishlist, product];
      await updateDoc(wishlistRef, { items: newWishlist });
      setWishlist(newWishlist);
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const wishlistRef = doc(db, 'wishlists', user.uid);
      const newWishlist = wishlist.filter(item => item.id !== productId);
      await updateDoc(wishlistRef, { items: newWishlist });
      setWishlist(newWishlist);
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistProvider; 