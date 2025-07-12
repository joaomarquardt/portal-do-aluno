import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
  login: (cpf: string, senha: string) => Promise<{ success: boolean; needsPasswordChange: boolean }>;
  logout: () => void;
  loading: boolean;
  changePassword: boolean;
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

  const login = async (cpf: string, senha: string): Promise<{ success: boolean; needsPasswordChange: boolean }> => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/login`, {
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
          idUsuario: decoded.idUsuario,
          idAluno: decoded.idAluno,
          idProfessor: decoded.idProfessor,
          role: decoded.roles?.[0] ?? 'ALUNO'
        };

        setUser(payload);
        localStorage.setItem('user', JSON.stringify(payload));
        localStorage.setItem('token', userData.token);

        const precisaRedefinirSenha = userData.precisaRedefinirSenha === true;

        setChangePassword(precisaRedefinirSenha);
        localStorage.setItem('changePassword', precisaRedefinirSenha.toString());

        return { success: true, needsPasswordChange: precisaRedefinirSenha };
      }

      return { success: false, needsPasswordChange: false };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, needsPasswordChange: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setChangePassword(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('changePassword');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
