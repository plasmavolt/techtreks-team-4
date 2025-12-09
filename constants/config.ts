// API Configuration
export const API_URL = 'http://localhost:3000';

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
