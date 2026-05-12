import { createContext, useState, useEffect, useCallback } from "react";
import { login as loginAPI, getCurrentUser, logoutAPI, refreshToken } from "../services/authService";
import { setAccessToken } from "../services/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load cached user profile for instant UI display while we verify the session
    try {
      const cached = localStorage.getItem('currentUser');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On mount: attempt a silent refresh using the HttpOnly cookie.
   * If the cookie is valid the backend returns a new access token and we restore
   * the session without any user interaction. If it fails the user goes to login.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const newToken = await refreshToken();
        setAccessToken(newToken);

        // Fetch fresh user profile
        const userData = await getCurrentUser();
        if (userData && (userData.name || userData.role)) {
          setUser(userData);
        }
        setIsAuthenticated(true);
      } catch {
        // No valid refresh cookie — user needs to log in
        setAccessToken(null);
        localStorage.removeItem('currentUser');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /** Login: store token in memory only, fetch user profile, set auth state. */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const data = await loginAPI(email, password);
      const newToken = data.accessToken;

      if (!newToken) {
        throw new Error('Login succeeded but no access token was returned.');
      }

      // Store token in memory ONLY — never in localStorage
      setAccessToken(newToken);

      // Fetch user profile immediately so RoleRoute has the role before redirect
      let userData = null;
      try {
        userData = await getCurrentUser();
        if (userData && (userData.name || userData.role)) {
          setUser(userData);
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
  }, []);

  /**
   * Logout: call the backend to revoke the refresh token / clear the cookie,
   * then wipe the in-memory token and cached user data.
   */
  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (err) {
      // Even if the API call fails we still clear local state
      console.error('Logout API error:', err);
    } finally {
      setAccessToken(null);
      localStorage.removeItem('currentUser');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const value = {
    user,
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