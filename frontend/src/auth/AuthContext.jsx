import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        try {
          const decodedUser = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          if (decodedUser.exp > currentTime) {
            setUser(decodedUser);
          } else {
            // Token expired, try to refresh it silently
            refreshToken().catch(() => {
              // If refresh fails, logout
              logout();
            });
          }
        } catch (error) {
          console.error("Error decoding token on initial load", error);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (accessToken, refreshToken) => {
    try {
      const decodedUser = jwtDecode(accessToken);
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
      setUser(decodedUser);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error decoding token on login", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem('refresh');
    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }
    try {
      const response = await api.post('/auth/refresh/', { refresh: currentRefreshToken });
      const { access } = response.data;
      const decodedUser = jwtDecode(access);

      localStorage.setItem('access', access);
      setUser(decodedUser);
      return access;
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
      throw error;
    }
  };

  const authValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
