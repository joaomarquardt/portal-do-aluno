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
  login: (cpf: string, senha: string) => Promise<{ success: boolean; needsPasswordChange: boolean; message?: string }>;
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

  const login = async (cpf: string, senha: string): Promise<{ success: boolean; needsPasswordChange: boolean; message?: string }> => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha })
      });
<<<<<<< HEAD
      console.log(cpf)
      
      console.log(senha)
      const userData = await response.json();
=======

      const userData = await response.json(); // Sempre tente ler o JSON

      if (!response.ok) {
        const errorMessage = userData?.message || `Erro ${response.status}: Falha na autenticação.`;
        return { success: false, needsPasswordChange: false, message: errorMessage };
      }
>>>>>>> ae3c29b54b7c6735e2e76d5cfa3f9bdceb622fcc

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
      } else {
        return { success: false, needsPasswordChange: false, message: 'Resposta de login inválida.' };
      }

    } catch (error: any) {
      console.error('Erro no login:', error);
      return { success: false, needsPasswordChange: false, message: 'Erro de conexão ou inesperado. Tente novamente.' };
    } finally {
      setLoading(false);
    }
  };

  const exit = async () =>{
    const res = fetch(`${apiUrl}/auth/logout`,{
      method:"POST",
      headers:{
        "content-type":"Application/json",
        "Authorization":`Bearer ${localStorage.getItem("token")}`
      },
      body:JSON.stringify({})
    })
  }

  const logout = () => {

    exit()
    setUser(null);
    setChangePassword(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('changePassword');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, changePassword, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
