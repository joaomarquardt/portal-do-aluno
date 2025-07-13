import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Interface que define a estrutura dos dados do perfil do usuário
interface UserProfileData {
  id: number;
  cpf: string;
  nome: string;
  emailPessoal: string;
  emailInstitucional: string;
  telefone: string;
  matricula: string;
  periodoAtual: number;
  periodoIngresso: string;
}

// Interface para os erros de validação do formulário
interface ProfileFormErrors {
  emailPessoal?: string;
  telefone?: string;
  submit?: string; // Para erros gerais de submissão/API
}

const UserProfileEditForm = () => {
  // Obtenção de dados do usuário e funções de autenticação/navegação
  const { user } = useAuth();
  const navigate = useNavigate();
  // idAluno pode ser undefined se o usuário não estiver autenticado ou os dados não carregarem
  const idAluno = user?.idAluno;

  // Estados para gerenciar o formulário, carregamento, salvamento e mensagens
  const [formData, setFormData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({}); // NOVO: Estado para erros de validação
  const [generalError, setGeneralError] = useState<string | null>(null); // Erro geral de carregamento/API
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // URL da API obtida das variáveis de ambiente do Vite
  const apiUrl = import.meta.env.VITE_URL_API;

  // Função para formatar o telefone (00) 00000-0000
  const formatTelefone = (value: string) => {
    value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos
    return value.replace(/^(\d{2})(\d)/g, '($1) $2') // Adiciona parênteses ao DDD
      .replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen
  };

  // Função de validação do formulário
  const validateForm = () => {
    let newErrors: ProfileFormErrors = {};
    let isValid = true;

    if (!formData) return false; // Não valida se formData é nulo

    // Validação de Email Pessoal
    if (!formData.emailPessoal.trim()) {
      newErrors.emailPessoal = 'O email pessoal é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.emailPessoal)) {
      newErrors.emailPessoal = 'Formato de email pessoal inválido.';
      isValid = false;
    }

    // Validação de Telefone
    const cleanedTelefone = formData.telefone.replace(/\D/g, '');
    if (!cleanedTelefone.trim()) {
      newErrors.telefone = 'O telefone é obrigatório.';
      isValid = false;
    } else if (cleanedTelefone.length !== 11) {
      newErrors.telefone = 'O telefone deve conter 11 dígitos (incluindo DDD).';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setGeneralError(null); // Limpa erros anteriores
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado. Por favor, faça login novamente.');
        }
        // Garante que idAluno existe antes de fazer a requisição
        if (!idAluno) {
          throw new Error('ID do aluno não disponível para buscar o perfil.');
        }

        const response = await axios.get<UserProfileData>(`${apiUrl}/alunos/${idAluno}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Formata o telefone ao carregar os dados
        setFormData({
          ...response.data,
          telefone: formatTelefone(response.data.telefone)
        });
      } catch (err: unknown) { // Captura o erro como 'unknown' para segurança de tipo
        console.error('Erro ao buscar dados do perfil:', err);
        // Verifica se o erro é uma instância de AxiosError de forma robusta
        if (
          typeof err === 'object' &&
          err !== null &&
          'isAxiosError' in err &&
          (err as { isAxiosError: boolean }).isAxiosError // Asserção para 'isAxiosError'
        ) {
          // Se for um AxiosError, tenta acessar a mensagem de erro da resposta da API
          const axiosError = err as { response?: { data?: { message?: string } } };
          setGeneralError(axiosError.response?.data?.message || 'Erro ao carregar perfil. Tente novamente.');
        } else if (err instanceof Error) { // Para outros erros JS padrão
          setGeneralError(err.message || 'Ocorreu um erro inesperado ao carregar seu perfil.');
        } else { // Para qualquer outro tipo de erro
          setGeneralError('Ocorreu um erro desconhecido ao carregar seu perfil.');
        }
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    };

    // Só busca o perfil se o usuário e a URL da API estiverem disponíveis
    if (user && apiUrl) {
      fetchProfile();
    } else {
      setLoading(false);
      setGeneralError("Usuário não autenticado ou URL da API não configurada.");
    }
  }, [idAluno, user, apiUrl]); // Dependências do useEffect

  // Handler para atualizar os dados do formulário conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Aplica a formatação para o telefone
    if (name === 'telefone') {
      newValue = formatTelefone(value);
    }

    setFormData(prev => (prev ? { ...prev, [name]: newValue } : null));

    // Limpa o erro do campo assim que o usuário começa a digitar
    if (formErrors[name as keyof ProfileFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ProfileFormErrors];
        return newErrors;
      });
    }
    setGeneralError(null); // Limpa erro geral ao digitar
    setSuccessMessage(null); // Limpa mensagem de sucesso ao digitar
  };

  // Handler para submeter o formulário de atualização de perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    if (!formData) return; // Não faz nada se os dados do formulário estiverem vazios

    setSaving(true); // Ativa o estado de salvamento
    setFormErrors({}); // Limpa erros de validação anteriores
    setGeneralError(null); // Limpa erro geral de API
    setSuccessMessage(null);

    // Executa a validação local
    if (!validateForm()) {
      setSaving(false);
      return; // Impede o envio se a validação falhar
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Por favor, faça login novamente.');
      }

      const targetId = user?.idAluno;

      // Cria um payload com os dados formatados para envio à API
      const payload = {
        ...formData,
        telefone: formData.telefone.replace(/\D/g, ''), // Remove formatação para enviar apenas números
      };

      await axios.put(`${apiUrl}/alunos/${targetId}`, payload, { // Usa o payload formatado
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/dashboard/aluno'), 2000);

    } catch (err: unknown) { // Captura o erro como 'unknown' para segurança de tipo
      console.error('Erro ao atualizar perfil:', err);
      if (
        typeof err === 'object' &&
        err !== null &&
        'isAxiosError' in err &&
        (err as { isAxiosError: boolean }).isAxiosError
      ) {
        // Se for um AxiosError, tenta acessar a mensagem de erro da resposta da API
        const axiosError = err as { response?: { data?: { message?: string } } };
        setFormErrors(prev => ({ ...prev, submit: axiosError.response?.data?.message || 'Erro ao atualizar perfil.' }));
      } else if (err instanceof Error) { // Para outros erros JS padrão
        setFormErrors(prev => ({ ...prev, submit: err.message || 'Ocorreu um erro inesperado ao atualizar seu perfil.' }));
      } else { // Para qualquer outro tipo de erro
        setFormErrors(prev => ({ ...prev, submit: 'Ocorreu um erro desconhecido ao atualizar seu perfil.' }));
      }
    } finally {
      setSaving(false); // Finaliza o estado de salvamento
    }
  };

  // Renderização condicional baseada nos estados de carregamento e erro
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Carregando perfil...</p>
      </div>
    );
  }

  if (generalError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-700 p-4">
        <p className="text-lg font-semibold mb-4">Erro:</p>
        <p className="mb-4">{generalError}</p>
        <button
          onClick={() => navigate('/dashboard/aluno')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
        >
          <ChevronLeft size={16} /> Voltar ao Dashboard
        </button>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Perfil não encontrado ou dados inválidos.</p>
      </div>
    );
  }

  // Componente principal: formulário de edição de perfil
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
          <button
            onClick={() => navigate('/dashboard/aluno')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Voltar
          </button>
        </div>

        {/* Seção de Informações da Matrícula */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
                <UserCheck size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Informações da Matrícula</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-gray-600">Período Atual:</p>
                    <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
                        <Calendar size={18} /> {formData.periodoAtual || 'N/A'}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">Período de Ingresso:</p>
                    <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
                        <Calendar size={18} /> {formData.periodoIngresso || 'N/A'}
                    </p>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600">Matrícula:</p>
                    <p className="text-lg font-bold text-gray-800">
                        {formData.matricula || 'N/A'}
                    </p>
                </div>
            </div>
        </div>

        {/* Formulário Principal de Edição */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="emailPessoal" className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal *</label>
            <input
              type="email"
              id="emailPessoal"
              name="emailPessoal"
              value={formData.emailPessoal}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.emailPessoal ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {formErrors.emailPessoal && <p className="text-red-500 text-xs mt-1">{formErrors.emailPessoal}</p>}
          </div>
          <div>
            <label htmlFor="emailInstitucional" className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
            <input
              type="email"
              id="emailInstitucional"
              name="emailInstitucional"
              value={formData.emailInstitucional}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.telefone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="(00) 00000-0000"
              maxLength={15} // (00) 00000-0000 tem 15 caracteres
              required
            />
            {formErrors.telefone && <p className="text-red-500 text-xs mt-1">{formErrors.telefone}</p>}
          </div>
          {formErrors.submit && <p className="text-red-600 text-sm">{formErrors.submit}</p>}
          {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? 'Salvando...' : (<><Save size={16} /> Salvar Alterações</>)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEditForm;
