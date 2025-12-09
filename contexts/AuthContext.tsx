import { API_ENDPOINTS } from '@/constants/config';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  name?: string;
  id: string; // username
  profilePicture?: string;
  questsCompleted?: number;
  points?: number;
  rank?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (username: string, password: string, email: string, name?: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  getStoredData: () => Promise<{ user: string | null; token: string | null }>;
  updateProfile: (updates: { name?: string; profilePicture?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to sanitize username for use as SecureStore key
// SecureStore keys cannot contain special characters
const sanitizeKey = (username: string): string => {
  return username.replace(/[^a-zA-Z0-9]/g, '_');
};

// Helper function to get account-specific keys
const getUserKey = (username: string) => `user_${sanitizeKey(username)}`;
const getTokenKey = (username: string) => `auth_token_${sanitizeKey(username)}`;
const USER_KEY = 'user'; // For current logged-in username
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
      // Get the current logged-in username
      const currentUsername = await SecureStore.getItemAsync(USER_KEY);
      if (currentUsername) {
        // Load user data for this specific account
        const userDataKey = getUserKey(currentUsername);
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

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      // Call backend API
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Sign in error:', data.error);
        return false;
      }

      // Extract user data and token from response
      const { user: userData, token } = data;

      // Store user data with username-based key
      const userDataKey = getUserKey(username);
      await SecureStore.setItemAsync(userDataKey, JSON.stringify(userData));

      // Store current logged-in username
      await SecureStore.setItemAsync(USER_KEY, username);

      // Store token with username-based key
      const tokenKey = getTokenKey(username);
      await SecureStore.setItemAsync(tokenKey, token);

      setUser(userData);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  };

  const signUp = async (
    username: string,
    password: string,
    email: string,
    name?: string
  ): Promise<boolean> => {
    try {
      // Basic validation
      if (!username || !username.trim()) {
        console.error('Sign up error: Username is required');
        return false;
      }

      if (!email || !email.trim()) {
        console.error('Sign up error: Email is required');
        return false;
      }

      if (!password || password.length < 6) {
        console.error('Sign up error: Password must be at least 6 characters');
        return false;
      }

      // Username validation
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(username.trim())) {
        console.error('Sign up error: Invalid username format');
        return false;
      }

      if (username.trim().length < 3) {
        console.error('Sign up error: Username must be at least 3 characters');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        console.error('Sign up error: Invalid email format');
        return false;
      }

      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim().toLowerCase();

      // Call backend API
      const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password,
          email: trimmedEmail,
          name: name && name.trim() ? name.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Sign up error:', data.error);
        return false;
      }

      // Extract user data and token from response
      const { user: userData, token } = data;

      // Store user data with username-based key
      const userDataKey = getUserKey(trimmedUsername);
      await SecureStore.setItemAsync(userDataKey, JSON.stringify(userData));

      // Store current logged-in username
      await SecureStore.setItemAsync(USER_KEY, trimmedUsername);

      // Store token with username-based key
      const tokenKey = getTokenKey(trimmedUsername);
      await SecureStore.setItemAsync(tokenKey, token);

      setUser(userData);
      console.log('Sign up successful for:', trimmedUsername);
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
      if (user?.id) {
        const tokenKey = getTokenKey(user.id);
        await SecureStore.deleteItemAsync(tokenKey);
      }
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getStoredData = async (): Promise<{ user: string | null; token: string | null }> => {
    try {
      // Get current username
      const currentUsername = await SecureStore.getItemAsync(USER_KEY);
      if (!currentUsername) {
        return { user: null, token: null };
      }

      // Get user data for this account
      const userDataKey = getUserKey(currentUsername);
      const userData = await SecureStore.getItemAsync(userDataKey);

      // Get token for this account
      const tokenKey = getTokenKey(currentUsername);
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
      if (!user || !user.id) return false;

      // Call backend API
      const response = await fetch(API_ENDPOINTS.USERS.UPDATE_USER(user.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Update profile error:', data.error);
        return false;
      }

      // Extract updated user data
      const updatedUser = data.user;

      // Store updated user data with username-based key (per account)
      const userDataKey = getUserKey(user.id);
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

