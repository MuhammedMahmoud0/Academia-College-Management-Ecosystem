import { createContext, useState, useEffect } from "react";
import { login as loginAPI , getCurrentUser} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await loginAPI(email, password);
      const newToken = data.token;
      const message = data.message;
      
      // Store token
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('message', message);

      setToken(newToken);
      setIsAuthenticated(true);
      
      return data;
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
          // Keep cached user data if API call fails
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