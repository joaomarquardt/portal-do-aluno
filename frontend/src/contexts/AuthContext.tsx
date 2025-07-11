
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // <- Correção aqui

interface User {
  nome: string;
  cpf: string;
  role: 'ADMIN' | 'PROFESSOR' | 'ALUNO';
}

interface AuthContextType {
  user: User | null;
  login: (cpf: string, senha: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (cpf: string, senha: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha })
      });

      const userData = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (userData?.token) {
        const decoded: any = jwtDecode(userData.token);

        const payload: User = {
          cpf: decoded.sub,
          nome: decoded.nome,
          role: decoded.roles?.[0] ?? 'ALUNO' // <- Se roles for array
        };

        setUser(payload);
        localStorage.setItem('user', JSON.stringify(payload));
        localStorage.setItem('token', userData.token)
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
