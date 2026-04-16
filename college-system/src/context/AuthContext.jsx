import { createContext, useState, useEffect } from "react";
import { login as loginAPI , getCurrentUser} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isUsableToken = (value) => {
    if (!value || typeof value !== 'string') return false;
    const normalized = value.trim().toLowerCase();
    return normalized !== 'undefined' && normalized !== 'null' && normalized.length > 0;
  };

  const extractToken = (data) => {
    return (
      data?.token ||
      data?.access_token ||
      data?.accessToken ||
      data?.data?.token ||
      data?.data?.access_token ||
      data?.data?.accessToken ||
      null
    );
  };

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('currentUser');
    
    // Load cached user data immediately for instant display
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing cached user data:', error);
      }
    }
    
    if (isUsableToken(savedToken)) {
      setToken(savedToken);
      setIsAuthenticated(true);
    } else if (savedToken) {
      // Clean up invalid token strings such as "undefined" or "null".
      localStorage.removeItem('auth_token');
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await loginAPI(email, password);
      const newToken = extractToken(data);
      const message = data.message;

      if (!isUsableToken(newToken)) {
        throw new Error('Login succeeded but no valid token was returned by the server.');
      }
      
      // Store token
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('message', message);
      setToken(newToken);

      // Fetch user immediately so RoleRoute has the role before the redirect
      let userData = null;
      try {
        userData = await getCurrentUser(newToken);
        if (userData && (userData.name || userData.role)) {
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
        }
      } catch (userErr) {
        console.error('Could not fetch user profile after login:', userErr);
      }

      setIsAuthenticated(true);
      return { ...data, fetchedUser: userData };
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current user data when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser(token);
          // Only update if we got valid user data
          if (userData && userData.name) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If token is invalid/expired, clear auth state to stop repeated unauthorized calls.
          // If token is invalid/expired, clear auth and force re-login.
          if (error?.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('message');
            localStorage.removeItem('currentUser');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            return;
          }

          // Keep cached user data for non-auth related errors.
        }
      }
    };
    fetchUser();
  }, [token]);


  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('message');
    localStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};      