import { createContext, useEffect, useState } from 'react';

import { authStorage } from './storage';

import api from '@/lib/axios';

type User = {
  id: string;
  email: string;
  name: string;
  // другие поля, если есть
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  fetchMe: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined); // <--- добавлен экспорт

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/user/me');

      setUser(res.data);
    } catch (err) {
      console.error(err);
      authStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = authStorage.getToken();

    if (token) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    authStorage.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}
