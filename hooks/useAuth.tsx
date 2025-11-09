
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthState {
  isLoggedIn: boolean;
  user: {
    name: string;
    isLifetime: boolean;
  } | null;
}

interface AuthContextType {
  auth: AuthState;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser = {
  name: 'Estudante',
  isLifetime: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
  });

  const login = () => {
    setAuth({
      isLoggedIn: true,
      user: mockUser,
    });
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
