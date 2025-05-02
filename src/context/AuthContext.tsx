import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, firestore } from '../config/firebase';
import { User } from '../types/user';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        try {
          const userDoc = await firestore.collection('users').doc(firebaseUser.uid).get();
          
          if (userDoc.exists) {
            const userData = userDoc.data() as User;
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: userData.name || '',
              photoURL: userData.photoURL || null,
              createdAt: userData.createdAt || new Date().toISOString(),
              preferences: userData.preferences || {},
            });
          } else {
            // Basic user data if Firestore data doesn't exist yet
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || null,
              createdAt: new Date().toISOString(),
              preferences: {},
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
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
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      
      if (userCredential.user) {
        // Update user profile
        await userCredential.user.updateProfile({
          displayName: name,
        });
        
        // Store additional user data in Firestore
        await firestore.collection('users').doc(userCredential.user.uid).set({
          name,
          email,
          createdAt: new Date().toISOString(),
          photoURL: null,
          preferences: {
            notifications: true,
            theme: 'light',
            privacyLevel: 'standard',
          },
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      if (!user || !user.id) throw new Error('No user logged in');
      
      // Update Firestore
      await firestore.collection('users').doc(user.id).update(userData);
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...userData } : null);
      
      // Update Firebase Auth profile if name or photo changed
      if (userData.name || userData.photoURL) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.updateProfile({
            displayName: userData.name || currentUser.displayName,
            photoURL: userData.photoURL || currentUser.photoURL,
          });
        }
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);