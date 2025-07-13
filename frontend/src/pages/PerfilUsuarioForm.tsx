import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Calendar, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

const UserProfileEditForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const idAluno = user?.idAluno;

  const [formData, setFormData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_URL_API;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticação não encontrado.');
        }
        const targetId = user?.idAluno;

        const response = await axios.get<UserProfileData>(`${apiUrl}/alunos/${targetId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setFormData(response.data);
      } catch (err) {
        console.error('Erro ao buscar dados do perfil:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Erro ao carregar perfil.');
        } else {
          setError('Ocorreu um erro inesperado ao carregar seu perfil.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("Usuário não autenticado.");
    }
  }, [idAluno, user, apiUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const targetId = user?.idAluno;

      await axios.put(`${apiUrl}/alunos/${targetId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => navigate('/dashboard/aluno'), 2000);

    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao atualizar perfil.');
      } else {
        setError('Ocorreu um erro inesperado ao atualizar seu perfil.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700 text-lg">Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-700 p-4">
        <p className="text-lg font-semibold mb-4">Erro:</p>
        <p className="mb-4">{error}</p>
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
            <p className="text-gray-700 text-lg">Perfil não encontrado.</p>
        </div>
    );
  }

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
            <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">Matricula</label>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.emailPessoal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
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
