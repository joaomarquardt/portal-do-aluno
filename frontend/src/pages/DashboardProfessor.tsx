import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, Award, MessageSquare } from 'lucide-react';
import axios from 'axios';

interface ComunicadoServ {
  id: number;
  titulo: string;
  mensagem: string;
  dataPublicacao: string;
}

interface ProfessorSummaryDTO {
  numTurmasAtivas: number;
  totalAlunosGerenciados: number;
  mediaGeralProfessor: number;
}

const apiUrl = import.meta.env.VITE_URL_API;

const DashboardProfessor = () => {
  const { user, logout } = useAuth();

  const [numTurmasAtivas, setNumTurmasAtivas] = useState<number | null>(null);
  const [totalAlunosGerenciados, setTotalAlunosGerenciados] = useState<number | null>(null);
  const [mediaGeralProfessor, setMediaGeralProfessor] = useState<number | null>(null);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);

  const [comunicados, setComunicados] = useState<ComunicadoServ[]>([]);
  const [loadingComunicados, setLoadingComunicados] = useState(true);
  const [errorComunicados, setErrorComunicados] = useState<string | null>(null);

  const fetchProfessorSummary = useCallback(async () => {
    setLoadingSummary(true);
    setErrorSummary(null);
    try {
      if (!user?.idProfessor) {
        throw new Error('ID do professor não encontrado.');
      }
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }
      const response = await axios.get<ProfessorSummaryDTO>(`${apiUrl}/professores/${user.idProfessor}/sumario-dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNumTurmasAtivas(response.data.numTurmasAtivas);
      setTotalAlunosGerenciados(response.data.totalAlunosGerenciados);
      setMediaGeralProfessor(response.data.mediaGeralProfessor);
    } catch (err) {
      console.error('Erro ao buscar sumário do professor:', err);
      if (axios.isAxiosError(err)) {
        setErrorSummary(err.response?.data?.message || 'Erro ao carregar sumário.');
      } else {
        setErrorSummary('Ocorreu um erro inesperado ao carregar o sumário.');
      }
      setNumTurmasAtivas(null);
      setTotalAlunosGerenciados(null);
      setMediaGeralProfessor(null);
    } finally {
      setLoadingSummary(false);
    }
  }, [apiUrl, user?.idProfessor]);

  const fetchComunicados = useCallback(async () => {
    setLoadingComunicados(true);
    setErrorComunicados(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }
      const response = await axios.get(`${apiUrl}/comunicados`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComunicados(response.data);
    } catch (err) {
      console.error('Erro ao buscar comunicados para o professor:', err);
      if (axios.isAxiosError(err)) {
        setErrorComunicados(err.response?.data?.message || 'Erro ao carregar comunicados.');
      } else {
        setErrorComunicados('Ocorreu um erro inesperado ao carregar comunicados.');
      }
    } finally {
      setLoadingComunicados(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchProfessorSummary();
  }, [fetchProfessorSummary]);

  useEffect(() => {
    fetchComunicados();
  }, [fetchComunicados]);

  if (!user) {
    return (
      <main className="p-6 text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        Aguardando dados do usuário...
      </main>
    );
  }

  if (errorSummary) {
    return (
      <main className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow text-center">
          <p className="font-bold">Erro ao carregar dados do professor:</p>
          <p>{errorSummary}</p>
        </div>
      </main>
    );
  }

  if (loadingSummary) {
    return (
      <main className="p-6 text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        Carregando dados do professor...
      </main>
    );
  }


  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Minhas Turmas</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {numTurmasAtivas !== null ? numTurmasAtivas : 'N/A'}
          </p>
          <p className="text-gray-600 text-sm">Turmas ativas</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Alunos</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {totalAlunosGerenciados !== null ? totalAlunosGerenciados : 'N/A'}
          </p>
          <p className="text-gray-600 text-sm">Total de alunos gerenciados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Média Geral Alunos</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {mediaGeralProfessor !== null ? mediaGeralProfessor.toFixed(2) : 'N/A'}
          </p>
          <p className="text-gray-600 text-sm">Notas nas suas turmas</p>
        </div>
      </div>

      {/* SEÇÃO DE COMUNICADOS */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Comunicados</h2>

        {loadingComunicados ? (
          <div className="text-center py-8 text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Carregando comunicados...
          </div>
        ) : errorComunicados ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow text-center">
            <p className="font-bold">Erro ao carregar comunicados:</p>
            <p>{errorComunicados}</p>
          </div>
        ) : comunicados.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <p>Nenhum comunicado no momento.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comunicados.map((comunicado) => {
              const dataObj = new Date(comunicado.dataPublicacao);
              const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }).format(dataObj);

              return (
                <div key={comunicado.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="font-semibold text-gray-800 text-sm">{comunicado.titulo}</p>
                  <p className="text-xs text-gray-600">{comunicado.mensagem}</p>
                  <p className="text-xs text-gray-600">{dataFormatada}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default DashboardProfessor;
