import { Platform } from 'react-native';

// API Configuration
// For iOS Simulator: use localhost
// For Android Emulator: use 10.0.2.2 (special IP that maps to host machine's localhost)
// For physical devices: use your computer's local IP address (e.g., 192.168.x.x or 10.17.x.x)
// You can also set this via environment variable if needed

const getApiBaseUrl = () => {
  // Check if we have an environment variable set
  // You can set EXPO_PUBLIC_API_URL in your .env file
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Default based on platform
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    // For physical Android device, change this to your computer's IP
    return 'http://10.0.2.2:3000';
  } else {
    // iOS simulator and web can use localhost
    return 'http://localhost:3000';
  }
};

export const API_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_URL}/api/auth/signup`,
    SIGNIN: `${API_URL}/api/auth/signin`,
  },
  USERS: {
    GET_USER: (id: string) => `${API_URL}/api/users/${id}`,
    UPDATE_USER: (id: string) => `${API_URL}/api/users/${id}`,
  },
  LOCATIONS: {
    GET_ALL: `${API_URL}/api/locations`,
  },
};
