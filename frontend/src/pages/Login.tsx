import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, GraduationCap } from 'lucide-react';

// Interface para os erros de validação do formulário de login
interface LoginFormErrors {
  cpf?: string;
  senha?: string;
  general?: string; // Para erros gerais como "CPF ou senha incorretos"
}

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [cpfView, setCpfView] = useState("");
  const [senha, setSenha] = useState('');
  // O estado tipoUsuario não é usado na chamada de login do AuthContext,
  // mas é mantido para a UI de seleção.
  const [tipoUsuario, setTipoUsuario] = useState<'PROFESSOR' | 'ALUNO'>('ALUNO');
  const [loginErrors, setLoginErrors] = useState<LoginFormErrors>({}); // NOVO: Estado para erros de validação

  const { login: authLogin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Função para validar os campos do formulário
  const validateForm = () => {
    let newErrors: LoginFormErrors = {};
    let isValid = true;

    // Validação do CPF
    if (!cpf.trim()) {
      newErrors.cpf = 'O CPF é obrigatório.';
      isValid = false;
    } else if (cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'O CPF deve conter 11 dígitos.';
      isValid = false;
    }

    // Validação da Senha
    if (!senha.trim()) {
      newErrors.senha = 'A senha é obrigatória.';
      isValid = false;
    } else if (senha.length < 6) { // Exemplo: senha mínima de 6 caracteres
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
      isValid = false;
    }

    setLoginErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({}); // Limpa erros anteriores ao tentar submeter

    // Executa a validação local
    if (!validateForm()) {
      return; // Se a validação falhar, impede o envio
    }

    try {
      const result = await authLogin(cpf, senha);

      if (result.success) {
        navigate('/'); // Redireciona para a rota raiz.
      } else {
        // Exibe a mensagem de erro que veio do AuthContext ou uma padrão
        setLoginErrors(prev => ({ ...prev, general: result.message || 'CPF ou senha incorretos.' }));
      }
    } catch (err) {
      console.error("Erro inesperado durante o login:", err);
      setLoginErrors(prev => ({ ...prev, general: "Ocorreu um erro inesperado. Tente novamente mais tarde." }));
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    // Aplica a máscara apenas se houver dígitos suficientes
    if (numbers.length > 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numbers.length > 6) {
      return numbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (numbers.length > 3) {
      return numbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    return numbers;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, ''); // Remove tudo que não é dígito

    if (numbers.length <= 11) {
      setCpf(numbers); // Armazena apenas os números no estado 'cpf'
      setCpfView(formatCPF(numbers)); // Armazena a versão formatada para exibição

      // Limpa o erro do CPF ao começar a digitar
      if (loginErrors.cpf) {
        setLoginErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.cpf;
          return newErrors;
        });
      }
      // Limpa erro geral ao digitar
      if (loginErrors.general) {
        setLoginErrors(prev => ({ ...prev, general: undefined }));
      }
    }
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
    // Limpa o erro da senha ao começar a digitar
    if (loginErrors.senha) {
      setLoginErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.senha;
        return newErrors;
      });
    }
    // Limpa erro geral ao digitar
    if (loginErrors.general) {
      setLoginErrors(prev => ({ ...prev, general: undefined }));
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
              CPF *
            </label>
            <input
              type="text"
              value={cpfView}
              onChange={handleCPFChange}
              className={`w-full px-3 py-2 border-2 rounded focus:border-blue-500 ${loginErrors.cpf ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
            {loginErrors.cpf && <p className="text-red-500 text-xs mt-1">{loginErrors.cpf}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha *
            </label>
            <input
              type="password"
              value={senha}
              onChange={handleSenhaChange} // Usando o novo handler
              className={`w-full px-3 py-2 border-2 rounded focus:border-blue-500 ${loginErrors.senha ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Digite sua senha"
              required
            />
            {loginErrors.senha && <p className="text-red-500 text-xs mt-1">{loginErrors.senha}</p>}
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

          {loginErrors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
              {loginErrors.general}
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