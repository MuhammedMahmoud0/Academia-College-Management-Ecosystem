import axios from 'axios';

/**
 * In-memory access token storage.
 * NEVER stored in localStorage / sessionStorage / cookies.
 * The refresh token lives in an HttpOnly cookie managed by the browser.
 */
let _accessToken = null;

/** Read the current in-memory access token. */
export const getAccessToken = () => _accessToken;

/** Update the in-memory access token (called by AuthContext after login / refresh). */
export const setAccessToken = (token) => {
  _accessToken = token;
};

/**
 * Shared Axios instance used by every service in this app.
 * - withCredentials: true  →  browser sends the HttpOnly refresh cookie automatically
 * - Request interceptor   →  attaches Authorization header from memory
 * - Response interceptor  →  silently refreshes the token on 401 and retries once
 */
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // required for HttpOnly refresh cookie
});

/* ── Request interceptor ──────────────────────────────────────────────────── */
apiClient.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers['Authorization'] = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor (silent refresh) ────────────────────────────────── */
let _isRefreshing = false;
let _refreshQueue = []; // pending requests while a refresh is in flight

const processQueue = (error, newToken = null) => {
  _refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newToken);
    }
  });
  _refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt silent refresh for 401s that haven't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (_isRefreshing) {
        // Queue this request until the ongoing refresh resolves
        return new Promise((resolve, reject) => {
          _refreshQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      _isRefreshing = true;

      try {
        // Browser automatically sends the HttpOnly refresh cookie
        const { data } = await apiClient.post('/auth/refresh');
        const newToken = data.accessToken;

        _accessToken = newToken;
        processQueue(null, newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        _accessToken = null;

        // Clear any cached user profile data
        localStorage.removeItem('currentUser');

        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
