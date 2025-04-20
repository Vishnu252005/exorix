import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, signIn as firebaseSignIn, logOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Temporary user credentials
const TEMP_USER = {
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'Premium Member',
  joinDate: '2024-03-15',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

interface User {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  role?: string;
  isAdmin?: boolean;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.isAdmin ? 'Admin' : 'User',
              isAdmin: userData.isAdmin,
              profileImage: userData.profileImage
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await firebaseSignIn(email, password);
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        login, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 