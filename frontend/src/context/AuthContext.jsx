import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// LOCAL BACKEND URL
const API_BASE_URL = 'http://localhost:3001';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Skip profile check for local dev
      setUser({ username: 'admin', role: 'IT Admin' });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    console.log('🔐 Login attempt:', username);
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
    
    console.log('✅ LOGIN SUCCESS:', userData);
    
    // Navigate to dashboard
    window.location.href = '/';
  };

  const register = async (username, password, role, email) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { username, password, role, email });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};