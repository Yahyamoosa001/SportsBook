import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';
import axios, { AxiosResponse } from 'axios';

// Types
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  verifyOtp: (otp: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Create axios instance for auth API
const authAPI = axios.create({
  baseURL: `${API_BASE_URL}/auth/v2`,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
class TokenManager {
  private static instance: TokenManager;
  private accessToken: string | null = null;
  private tokenExpiryTime: number | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(token: string, expiresIn: number): void {
    this.accessToken = token;
    // Set expiry time with 1 minute buffer to refresh before actual expiry
    this.tokenExpiryTime = Date.now() + (expiresIn * 1000) - (60 * 1000);
  }

  getToken(): string | null {
    return this.accessToken;
  }

  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiryTime = null;
    this.refreshPromise = null;
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpiryTime) return true;
    return Date.now() >= this.tokenExpiryTime;
  }

  shouldRefreshToken(): boolean {
    if (!this.accessToken || !this.tokenExpiryTime) return false;
    // Refresh if token expires in the next 2 minutes
    return Date.now() >= (this.tokenExpiryTime - (2 * 60 * 1000));
  }

  async refreshToken(refreshFn: () => Promise<boolean>): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = refreshFn();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }
}

// Create API client with interceptors
const createAPIClient = (tokenManager: TokenManager, refreshTokenFn: () => Promise<boolean>) => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  // Request interceptor to add access token
  apiClient.interceptors.request.use(
    async (config) => {
      const token = tokenManager.getToken();
      
      if (token) {
        // Check if token should be refreshed before making the request
        if (tokenManager.shouldRefreshToken()) {
          console.log('Token needs refresh, attempting refresh...');
          const refreshSuccess = await tokenManager.refreshToken(refreshTokenFn);
          
          if (refreshSuccess) {
            // Use the new token
            const newToken = tokenManager.getToken();
            if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
            }
          } else {
            // Refresh failed, proceed without token
            console.warn('Token refresh failed, proceeding without token');
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiry
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const errorCode = error.response.data?.code;
        
        if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
          console.log('Access token expired, attempting refresh...');
          
          const refreshSuccess = await tokenManager.refreshToken(refreshTokenFn);
          
          if (refreshSuccess) {
            // Retry the original request with new token
            const newToken = tokenManager.getToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return apiClient(originalRequest);
            }
          } else {
            // Refresh failed, redirect to login will be handled by auth context
            console.warn('Token refresh failed, user needs to login again');
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Auth Provider Component
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tokenManager = TokenManager.getInstance();

  // Internal refresh function
  const performTokenRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authAPI.post<{ success: boolean; data: AuthResponse }>('/refresh');
      
      if (response.data.success) {
        const { user: userData, accessToken: newToken, expiresIn } = response.data.data;
        
        setUser(userData);
        setAccessToken(newToken);
        tokenManager.setToken(newToken, expiresIn);
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // If refresh token is invalid/expired, clear all auth state
      if (error.response?.data?.code === 'INVALID_REFRESH_TOKEN' || 
          error.response?.data?.code === 'REFRESH_TOKEN_EXPIRED' ||
          error.response?.data?.code === 'NO_REFRESH_TOKEN') {
        setUser(null);
        setAccessToken(null);
        tokenManager.clearToken();
      }
      
      return false;
    }
  }, [tokenManager]);

  // Create API client with refresh capability
  const apiClient = createAPIClient(tokenManager, performTokenRefresh);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Try to refresh token on app load
        const refreshSuccess = await performTokenRefresh();
        
        if (!refreshSuccess) {
          // No valid refresh token, user needs to login
          setUser(null);
          setAccessToken(null);
          tokenManager.clearToken();
        }
        
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setUser(null);
        setAccessToken(null);
        tokenManager.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [performTokenRefresh, tokenManager]);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.post<{ success: boolean; data: AuthResponse }>('/login', credentials);
      
      if (response.data.success) {
        const { user: userData, accessToken: token, expiresIn } = response.data.data;
        
        setUser(userData);
        setAccessToken(token);
        tokenManager.setToken(token, expiresIn);
        
        toast.success('Login successful!');
        
        // Redirect based on user role
        setTimeout(() => {
          switch (userData.role) {
            case 'admin':
              window.location.href = '/admin/dashboard';
              break;
            case 'facility_owner':
              window.location.href = '/owner/dashboard';
              break;
            case 'user':
            default:
              window.location.href = '/venues';
              break;
          }
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      await authAPI.post('/register', data);
      toast.success('Registration successful! Please check your email for OTP verification.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Verify OTP function
  const verifyOtp = async (otp: string, rememberMe = false) => {
    try {
      const response = await authAPI.post<{ success: boolean; data: AuthResponse }>('/verify-otp', { 
        otp, 
        rememberMe 
      });
      
      if (response.data.success) {
        const { user: userData, accessToken: token, expiresIn } = response.data.data;
        
        setUser(userData);
        setAccessToken(token);
        tokenManager.setToken(token, expiresIn);
        
        toast.success('Email verified successfully!');
        
        // Redirect based on user role
        setTimeout(() => {
          switch (userData.role) {
            case 'admin':
              window.location.href = '/admin/dashboard';
              break;
            case 'facility_owner':
              window.location.href = '/owner/dashboard';
              break;
            case 'user':
            default:
              window.location.href = '/venues';
              break;
          }
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.post('/auth/v2/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setAccessToken(null);
      tokenManager.clearToken();
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  };

  // Logout from all devices
  const logoutAll = async () => {
    try {
      await apiClient.post('/auth/v2/logout-all');
    } catch (error) {
      console.error('Logout all API call failed:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setAccessToken(null);
      tokenManager.clearToken();
      toast.success('Logged out from all devices');
      window.location.href = '/';
    }
  };

  // Refresh token function (exposed for manual refresh)
  const refreshToken = async (): Promise<boolean> => {
    return tokenManager.refreshToken(performTokenRefresh);
  };

  const value: AuthContextType = {
    user,
    accessToken,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    login,
    register,
    verifyOtp,
    logout,
    logoutAll,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the API client for use in other parts of the app
export const createAuthenticatedAPIClient = () => {
  const tokenManager = TokenManager.getInstance();
  
  // This function should be called after the AuthProvider is initialized
  const refreshTokenFn = async (): Promise<boolean> => {
    try {
      const response = await authAPI.post('/refresh');
      if (response.data.success) {
        const { accessToken: newToken, expiresIn } = response.data.data;
        tokenManager.setToken(newToken, expiresIn);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  return createAPIClient(tokenManager, refreshTokenFn);
};
