import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  name?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  getStoredData: () => Promise<{ user: string | null; token: string | null }>;
  updateProfile: (updates: { name?: string; profilePicture?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to sanitize email for use as SecureStore key
// SecureStore keys cannot contain special characters like @, ., etc.
const sanitizeKey = (email: string): string => {
  return email.replace(/[^a-zA-Z0-9]/g, '_');
};

// Helper function to get account-specific keys
const getUserKey = (email: string) => `user_${sanitizeKey(email)}`;
const getTokenKey = (email: string) => `auth_token_${sanitizeKey(email)}`;
const USER_KEY = 'user'; // For current logged-in user email
const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Get the current logged-in user's email
      const currentUserEmail = await SecureStore.getItemAsync(USER_KEY);
      if (currentUserEmail) {
        // Load user data for this specific account
        const userDataKey = getUserKey(currentUserEmail);
        const userData = await SecureStore.getItemAsync(userDataKey);
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // For now, this is a mock authentication
      // In production, you'd call your backend API here
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (replace with real API)
      if (email && password.length >= 6) {
        // Check if user already exists (to preserve profile data)
        const userDataKey = getUserKey(email);
        const existingUserData = await SecureStore.getItemAsync(userDataKey);
        
        let userData: User;
        if (existingUserData) {
          // User exists, preserve their profile data
          userData = JSON.parse(existingUserData);
        } else {
          // New user, create fresh data
          userData = { email };
        }
        
        // Store user data with email-based key
        await SecureStore.setItemAsync(userDataKey, JSON.stringify(userData));
        // Store current logged-in user email
        await SecureStore.setItemAsync(USER_KEY, email);
        // Store token with email-based key
        const tokenKey = getTokenKey(email);
        await SecureStore.setItemAsync(tokenKey, 'mock_token_' + Date.now());
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      // Basic validation
      if (!email || !email.trim()) {
        console.error('Sign up error: Email is required');
        return false;
      }

      if (!password || password.length < 6) {
        console.error('Sign up error: Password must be at least 6 characters');
        return false;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        console.error('Sign up error: Invalid email format');
        return false;
      }

      // TODO: Replace with actual API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trimmedEmail = email.trim();
      const userData: User = { 
        email: trimmedEmail, 
        ...(name && name.trim() && { name: name.trim() })
      };
      
      // Store user data with email-based key
      const userDataKey = getUserKey(trimmedEmail);
      await SecureStore.setItemAsync(userDataKey, JSON.stringify(userData));
      
      // Store current logged-in user email
      await SecureStore.setItemAsync(USER_KEY, trimmedEmail);
      
      // Store token with email-based key
      const tokenKey = getTokenKey(trimmedEmail);
      await SecureStore.setItemAsync(tokenKey, 'mock_token_' + Date.now());
      
      setUser(userData);
      console.log('Sign up successful for:', trimmedEmail);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Only clear the current user reference, keep account data
      await SecureStore.deleteItemAsync(USER_KEY);
      // Clear token for current user
      if (user?.email) {
        const tokenKey = getTokenKey(user.email);
        await SecureStore.deleteItemAsync(tokenKey);
      }
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getStoredData = async (): Promise<{ user: string | null; token: string | null }> => {
    try {
      // Get current user email
      const currentUserEmail = await SecureStore.getItemAsync(USER_KEY);
      if (!currentUserEmail) {
        return { user: null, token: null };
      }
      
      // Get user data for this account
      const userDataKey = getUserKey(currentUserEmail);
      const userData = await SecureStore.getItemAsync(userDataKey);
      
      // Get token for this account
      const tokenKey = getTokenKey(currentUserEmail);
      const token = await SecureStore.getItemAsync(tokenKey);
      
      return {
        user: userData,
        token: token,
      };
    } catch (error) {
      console.error('Error getting stored data:', error);
      return { user: null, token: null };
    }
  };

  const updateProfile = async (updates: { name?: string; profilePicture?: string }): Promise<boolean> => {
    try {
      if (!user || !user.email) return false;

      const updatedUser: User = {
        ...user,
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.profilePicture !== undefined && { profilePicture: updates.profilePicture }),
      };

      // If profilePicture is explicitly set to null, remove it
      if (updates.profilePicture === null) {
        updatedUser.profilePicture = undefined;
      }

      // Store updated user data with email-based key (per account)
      const userDataKey = getUserKey(user.email);
      await SecureStore.setItemAsync(userDataKey, JSON.stringify(updatedUser));

      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, getStoredData, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

