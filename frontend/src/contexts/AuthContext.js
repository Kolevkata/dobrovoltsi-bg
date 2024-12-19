// /src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/tokenUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: JSON.parse(localStorage.getItem('user')),
  });

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setAuth({ accessToken: null, refreshToken: null, user: null });
    navigate('/login');
  }, [navigate]);

  const refreshAccessToken = useCallback(async () => {
    try {
      if (!auth.refreshToken) {
        logout();
        return null;
      }
      const res = await axios.post('/auth/refresh-token', {
        refreshToken: auth.refreshToken,
      });
      const { accessToken, refreshToken } = res.data;
      setAuth((prevAuth) => ({
        ...prevAuth,
        accessToken,
        refreshToken,
      }));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      return null;
    }
  }, [auth.refreshToken, logout]);

  useEffect(() => {
    if (auth.accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`;
    }

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry &&
          auth.refreshToken
        ) {
          originalRequest._retry = true;
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (auth.accessToken && isTokenExpired(auth.accessToken)) {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          } else {
            return Promise.reject(new Error('Неуспешно обновяване на токена'));
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [auth.accessToken, auth.refreshToken, refreshAccessToken]);

  const login = (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setAuth({ accessToken, refreshToken, user });
  };

  const register = (accessToken, refreshToken, user) => {
    login(accessToken, refreshToken, user);
  };

  const updateUser = (user) => {
    setAuth((prev) => {
      const updated = { ...prev, user };
      localStorage.setItem('user', JSON.stringify(user));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
