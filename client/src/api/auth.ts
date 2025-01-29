import api from './api';

// Description: Login user
// Endpoint: POST /api/auth/login
// Request: { email: string, password: string }
// Response: { success: boolean, token: string }
export const login = (data: { email: string; password: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, token: 'mock_token_12345' });
    }, 500);
  });
};

// Description: Register user
// Endpoint: POST /api/auth/register
// Request: { email: string, password: string }
// Response: { success: boolean, message: string }
export const register = (data: { email: string; password: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Registration successful' });
    }, 500);
  });
};