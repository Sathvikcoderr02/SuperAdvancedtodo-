import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optionally fetch user data here if needed
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${config.apiBaseUrl}/auth/login`, {
        email,
        password,
      });

      const { token, ...userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${config.apiBaseUrl}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, ...userData } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Remove token and user data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
