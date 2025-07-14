import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
  nome: string;
  cpf: string;
  idUsuario: number;
  idAluno?: number;
  idProfessor?: number;
  role: 'ADMIN' | 'PROFESSOR' | 'ALUNO';
}

interface AuthContextType {
  user: User | null;
  login: (cpf: string, senha: string, tipoUsuario: 'PROFESSOR' | 'ALUNO') => Promise<{ success: boolean; needsPasswordChange: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  changePassword: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const apiUrl = import.meta.env.VITE_URL_API;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [changePassword, setChangePassword] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedChangePassword = localStorage.getItem('changePassword');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedChangePassword) {
      setChangePassword(savedChangePassword === 'true');
    }

    setLoading(false);
  }, []);

  const login = async (cpf: string, senha: string, tipoUsuario: 'PROFESSOR' | 'ALUNO'): Promise<{ success: boolean; needsPasswordChange: boolean; message?: string }> => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha })
      });

      const userData = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!response.ok) {
        const errorMessage = userData?.message || `Erro ${response.status}: Falha na autenticação.`;
        return { success: false, needsPasswordChange: false, message: errorMessage };
      }

      if (userData?.token) {
        const decoded: any = jwtDecode(userData.token);

        const payload: User = {
          cpf: decoded.sub,
          nome: decoded.nome,
          idUsuario: decoded.idUsuario,
          idAluno: decoded.idAluno,
          idProfessor: decoded.idProfessor,
          role: decoded.roles?.[0] ?? 'ALUNO'
        };

        if (payload.role !== 'ADMIN' && payload.role !== tipoUsuario) {
          return {
            success: false,
            needsPasswordChange: false,
            message: `Você tentou logar como ${tipoUsuario}, mas suas credenciais são de ${payload.role}. Por favor, selecione o tipo correto.`
          };
        }

        setUser(payload);
        localStorage.setItem('user', JSON.stringify(payload));
        localStorage.setItem('token', userData.token);

        const precisaRedefinirSenha = userData.precisaRedefinirSenha === true;

        setChangePassword(precisaRedefinirSenha);
        localStorage.setItem('changePassword', precisaRedefinirSenha.toString());

        return { success: true, needsPasswordChange: precisaRedefinirSenha };
      }

      return { success: false, needsPasswordChange: false, message: 'Resposta de login inválida: Token não encontrado.' };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { success: false, needsPasswordChange: false, message: 'Erro de conexão ou inesperado. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`${apiUrl}/auth/logout`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Logout no backend realizado com sucesso (se o endpoint respondeu).');
      }
    } catch (error) {
      console.error('Erro ao fazer logout no backend:', error);
    } finally {
      setUser(null);
      setChangePassword(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('changePassword');
      window.location.href = '/login'
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, changePassword, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
