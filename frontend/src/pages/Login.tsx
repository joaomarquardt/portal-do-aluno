import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, GraduationCap } from 'lucide-react';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [cpfView, setCpfView] = useState("");
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'PROFESSOR' | 'ALUNO'>('ALUNO');
  const [error, setError] = useState<string | null>(null);

  const { login: authLogin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    

    if (!cpf || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const result = await authLogin(cpf, senha, tipoUsuario);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'CPF ou senha incorretos.');
      }
    } catch (err) {
      console.error("Erro inesperado durante o login:", err);
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      setCpfView(formatCPF(numbers));
      setCpf(numbers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistema Acadêmico</h1>
          <p className="text-gray-600">Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              value={cpfView}
              onChange={handleCPFChange}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuário
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="tipoUsuario"
                  value="ALUNO"
                  checked={tipoUsuario === 'ALUNO'}
                  onChange={(e) => setTipoUsuario(e.target.value as 'ALUNO')}
                  className="w-4 h-4"
                />
                <Users className="text-blue-600" size={20} />
                <span className="font-medium text-gray-700">Aluno</span>
              </label>
              <label className="flex items-center gap-2 p-3 border-2 border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="tipoUsuario"
                  value="PROFESSOR"
                  checked={tipoUsuario === 'PROFESSOR'}
                  onChange={(e) => setTipoUsuario(e.target.value as 'PROFESSOR')}
                  className="w-4 h-4"
                />
                <GraduationCap className="text-green-600" size={20} />
                <span className="font-medium text-gray-700">Professor</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {authLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
