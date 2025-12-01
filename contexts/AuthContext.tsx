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

const USER_KEY = 'user';
const TOKEN_KEY = 'auth_token';
const PROFILE_PICTURE_KEY = 'profile_picture';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      const profilePicture = await SecureStore.getItemAsync(PROFILE_PICTURE_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        if (profilePicture) {
          user.profilePicture = profilePicture;
        }
        setUser(user);
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
        const userData: User = { email };
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        await SecureStore.setItemAsync(TOKEN_KEY, 'mock_token_' + Date.now());
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
      // TODO: Replace with actual API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (replace with real API)
      if (email && password.length >= 6) {
        const userData: User = { email, name };
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        await SecureStore.setItemAsync(TOKEN_KEY, 'mock_token_' + Date.now());
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getStoredData = async (): Promise<{ user: string | null; token: string | null }> => {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
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
      if (!user) return false;

      const updatedUser: User = {
        ...user,
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.profilePicture !== undefined && { profilePicture: updates.profilePicture }),
      };

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
      
      if (updates.profilePicture) {
        await SecureStore.setItemAsync(PROFILE_PICTURE_KEY, updates.profilePicture);
      } else if (updates.profilePicture === null) {
        // Remove profile picture
        await SecureStore.deleteItemAsync(PROFILE_PICTURE_KEY);
        updatedUser.profilePicture = undefined;
      }

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

