import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { clearTokens, getAccessToken, setTokens } from '../lib/auth';
import { clearCart } from '../lib/cart';

export type User = {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    phone: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    setUser(response.data.user);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    phone: string,
  ) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      firstName,
      lastName,
      birthDate,
      phone,
    });
    setTokens(response.data.tokens.accessToken, response.data.tokens.refreshToken);
    setUser(response.data.user);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    clearCart();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
