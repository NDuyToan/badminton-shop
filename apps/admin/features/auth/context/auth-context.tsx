'use client';

import React, { createContext, useContext, useState, useTransition } from 'react';
import { AuthUser } from '../types/auth.type';
import { logoutAction } from '../actions/auth.actions';

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoggingOut, startTransition] = useTransition();

  const logout = async () => {
    startTransition(async () => {
      setUser(null);
      await logoutAction();
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
