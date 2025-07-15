import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, ChevronUp, BookOpen, Calendar, Clock, User, Hash, BarChart2, PieChart } from 'lucide-react';

enum TurmaStatus {
  ATIVA = 'ATIVA',
  ENCERRADA = 'ENCERRADA',
}

interface TurmaDesempenhoBase {
  id: number;
  status: TurmaStatus;
  codigoTurma: string;
  nomeDisciplina: string;
  periodo: string;
  horario: string;
  nomeProfessor: string;
  cargaHoraria: number;
}

interface DesempenhoAluno {
  turma: TurmaDesempenhoBase;
  valor: number;
  horasRegistradas: number;
}

const apiUrl = import.meta.env.VITE_URL_API;

const TurmasAluno = () => {
  const { user } = useAuth();

  const [turmasAtivas, setTurmasAtivas] = useState<DesempenhoAluno[]>([]);
  const [turmasEncerradas, setTurmasEncerradas] = useState<DesempenhoAluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAtivasExpanded, setIsAtivasExpanded] = useState(false);
  const [isEncerradasExpanded, setIsEncerradasExpanded] = useState(false);

  const [expandedTurmasIds, setExpandedTurmasIds] = useState<number[]>([]);

  const fetchTodasTurmasAluno = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.idAluno) {
        setError('ID do aluno não encontrado para buscar turmas.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await axios.get<DesempenhoAluno[]>(`${apiUrl}/alunos/${user.idAluno}/turmas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todasTurmas: DesempenhoAluno[] = response.data;

      const ativas = todasTurmas.filter(d => d.turma.status === TurmaStatus.ATIVA);
      const encerradas = todasTurmas.filter(d => d.turma.status === TurmaStatus.ENCERRADA);

      setTurmasAtivas(ativas);
      setTurmasEncerradas(encerradas);

    } catch (err) {
      console.error('Erro ao buscar turmas inscritas e desempenho:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao carregar turmas.');
      } else {
        setError('Ocorreu um erro inesperado ao carregar dados de turmas.');
      }
      setTurmasAtivas([]);
      setTurmasEncerradas([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user?.idAluno]);

  useEffect(() => {
    fetchTodasTurmasAluno();
  }, [fetchTodasTurmasAluno]);

  const toggleTurma = (id: number) => {
    setExpandedTurmasIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const toggleAtivasSection = () => setIsAtivasExpanded(prev => !prev);
  const toggleEncerradasSection = () => setIsEncerradasExpanded(prev => !prev);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Carregando minhas turmas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow text-center">
          <p className="font-bold">Erro ao carregar turmas:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Minhas Turmas</h2>

        <div className="mb-8">
          <button
            onClick={toggleAtivasSection}
            className="w-full text-left p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 flex justify-between items-center text-xl font-semibold"
          >
            Turmas Ativas ({turmasAtivas.length})
            {isAtivasExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
          {isAtivasExpanded && (
            <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm mt-2 p-4 space-y-4">
              {turmasAtivas.length === 0 ? (
                <div className="text-center text-gray-600 py-4">Nenhuma turma ativa no momento.</div>
              ) : (
                turmasAtivas.map((desempenho) => (
                  <div
                    key={desempenho.turma.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <button
                      onClick={() => toggleTurma(desempenho.turma.id)}
                      className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                          <BookOpen size={20} /> {desempenho.turma.nomeDisciplina}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Hash size={16} /> {desempenho.turma.codigoTurma}
                        </span>
                      </div>
                      {expandedTurmasIds.includes(desempenho.turma.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>

                    <div className="p-4 space-y-2 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" />
                        <span><strong>Período:</strong> {desempenho.turma.periodo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-blue-600" />
                        <span><strong>Horário:</strong> {desempenho.turma.horario}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-blue-600" />
                        <span><strong>Professor:</strong> {desempenho.turma.nomeProfessor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-600" />
                        <span><strong>Carga Horária:</strong> {desempenho.turma.cargaHoraria}h</span>
                      </div>
                    </div>

                    {expandedTurmasIds.includes(desempenho.turma.id) && (
                      <div className="bg-white border-t border-gray-200 p-4 mt-2">
                        <div className="flex flex-col md:flex-row gap-6 text-gray-700">
                          <div className="flex items-center gap-2">
                            <BarChart2 size={20} className="text-green-600" />
                            <span><strong>Média final:</strong> {desempenho.valor !== null ? desempenho.valor.toFixed(1) : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PieChart size={20} className="text-indigo-600" />
                            <span>
                              <strong>Frequência:</strong>{' '}
                              {desempenho.horasRegistradas !== null
                                ? `${((desempenho.horasRegistradas / desempenho.turma.cargaHoraria) * 100).toFixed(1)}%`
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {turmasEncerradas.length > 0 && (
          <div className="mb-6">
            <button
              onClick={toggleEncerradasSection}
              className="w-full text-left p-4 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 flex justify-between items-center text-xl font-semibold"
            >
              Turmas Encerradas ({turmasEncerradas.length})
              {isEncerradasExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>
            {isEncerradasExpanded && (
              <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm mt-2 p-4 space-y-4">
                {turmasEncerradas.map((desempenho) => (
                  <div
                    key={desempenho.turma.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <button
                      onClick={() => toggleTurma(desempenho.turma.id)}
                      className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                          <BookOpen size={20} /> {desempenho.turma.nomeDisciplina}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Hash size={16} /> {desempenho.turma.codigoTurma}
                        </span>
                      </div>
                      {expandedTurmasIds.includes(desempenho.turma.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>

                    <div className="p-4 space-y-2 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" />
                        <span><strong>Período:</strong> {desempenho.turma.periodo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-blue-600" />
                        <span><strong>Horário:</strong> {desempenho.turma.horario}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-blue-600" />
                        <span><strong>Professor:</strong> {desempenho.turma.nomeProfessor}</span>
                      </div>
                       <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-blue-600" />
                        <span><strong>Carga Horária:</strong> {desempenho.turma.cargaHoraria}h</span>
                      </div>
                    </div>

                    {expandedTurmasIds.includes(desempenho.turma.id) && (
                      <div className="bg-white border-t border-gray-200 p-4 mt-2">
                        <div className="flex flex-col md:flex-row gap-6 text-gray-700">
                          <div className="flex items-center gap-2">
                            <BarChart2 size={20} className="text-green-600" />
                            <span><strong>Média final:</strong> {desempenho.valor !== null ? desempenho.valor.toFixed(1) : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <PieChart size={20} className="text-indigo-600" />
                            <span>
                              <strong>Frequência:</strong>{' '}
                              {desempenho.horasRegistradas !== null
                                ? `${((desempenho.horasRegistradas / desempenho.turma.cargaHoraria) * 100).toFixed(1)}%`
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {turmasAtivas.length === 0 && turmasEncerradas.length === 0 && !loading && !error && (
            <div className="text-center text-gray-600 py-8">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p>Você não está inscrito em nenhuma turma no momento.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TurmasAluno;
