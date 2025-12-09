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
    // iOS: Use local IP address (works for both simulator and physical device)
    // For iOS Simulator, you can also use 'http://localhost:3000'
    // For physical iOS device, use your computer's local IP (e.g., 10.16.76.160)
    // Update this IP address if your computer's IP changes
    return 'http://10.16.76.160:3000';
  }
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  locations: `${API_BASE_URL}/api/locations`,
  places: `${API_BASE_URL}/api/places`,
  events: `${API_BASE_URL}/api/events`,
  users: `${API_BASE_URL}/api/users`,
};

