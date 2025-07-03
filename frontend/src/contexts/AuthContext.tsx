
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  nome: string;
  cpf: string;
  role: 'admin' | 'professor' | 'estudante';
}

interface AuthContextType {
  user: User | null;
  login: (cpf: string, senha: string, tipoUsuario: 'professor' | 'estudante') => Promise<boolean>;
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
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (cpf: string, senha: string, tipoUsuario: 'professor' | 'estudante'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // ===== BACKEND INTEGRATION NEEDED =====
      // Aqui você deve fazer a chamada para o backend:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ cpf, senha, tipoUsuario })
      // });
      // const userData = await response.json();
      
      // SIMULAÇÃO TEMPORÁRIA - REMOVER QUANDO INTEGRAR COM BACKEND
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
      
      // Dados mockados para teste - REMOVER QUANDO INTEGRAR COM BACKEND
      const mockUsers = {
        'admin': { id: '1', nome: 'Administrador', cpf: '11111111111', role: 'admin' as const },
        'professor': { id: '2', nome: 'Professor Teste', cpf: '22222222222', role: 'professor' as const },
        'estudante': { id: '3', nome: 'Estudante Teste', cpf: '33333333333', role: 'estudante' as const }
      };
      
      let userData = null;
      if (cpf === '11111111111' && senha === '123') {
        userData = mockUsers.admin;
      } else if (cpf === '22222222222' && senha === '123' && tipoUsuario === 'professor') {
        userData = mockUsers.professor;
      } else if (cpf === '33333333333' && senha === '123' && tipoUsuario === 'estudante') {
        userData = mockUsers.estudante;
      }
      // ===== FIM DA SIMULAÇÃO =====
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
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
