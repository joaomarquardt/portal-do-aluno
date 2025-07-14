import { useState, useEffect, useCallback } from 'react'; 
import axios from 'axios'; 
import { useAuth } from '@/contexts/AuthContext'; 
import { BookOpen, Users, Calendar, Hash, Clock, CheckCircle } from 'lucide-react';


interface TurmaAtivaProfessor {
  id: number;
  codigoTurma: string; 
  nomeDisciplina: string; 
  periodo: string; 
  horario: string;
  nomeProfessor: string; 
  cargaHoraria: number; 

  alunosInscritos?: number; 
  vagasTotal?: number; 
  vagasDisponiveis?: number; 
  local?: string; 
}

const apiUrl = import.meta.env.VITE_URL_API;

const DisciplinasProfessor = () => {
  const { user } = useAuth();
  
  const [turmasAtivas, setTurmasAtivas] = useState<TurmaAtivaProfessor[]>([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  
  const fetchTurmasAtivas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.idProfessor) { 
        setError('ID do professor não encontrado para buscar turmas.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

     
      const response = await axios.get<TurmaAtivaProfessor[]>(`${apiUrl}/professores/${user.idProfessor}/turmas-ativas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTurmasAtivas(response.data); 
    } catch (err) {
      console.error('Erro ao buscar turmas ativas do professor:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao carregar turmas ativas.');
      } else {
        setError('Ocorreu um erro inesperado ao carregar turmas ativas.');
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user?.idProfessor]); 

  
  useEffect(() => {
    fetchTurmasAtivas();
  }, [fetchTurmasAtivas]); 


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Carregando minhas disciplinas...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow text-center">
          <p className="font-bold">Erro ao carregar disciplinas:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Minhas Disciplinas</h2>

        {turmasAtivas.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p>Nenhuma disciplina ativa encontrada para este professor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {turmasAtivas.map((turma) => ( 
              <div
                key={turma.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                    <BookOpen size={20} /> {turma.nomeDisciplina} {}
                  </h3>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Hash size={16} /> {turma.codigoTurma} {}
                  </span>
                </div>

                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    <span><strong>Período:</strong> {turma.periodo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    <span><strong>Horário:</strong> {turma.horario}</span> 
                  </div>
               
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-600" />
                    <span><strong>Carga Horária:</strong> {turma.cargaHoraria}h</span>
                  </div>
                  
                  
                  {turma.alunosInscritos !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-blue-600" />
                      <span><strong>Alunos:</strong> {turma.alunosInscritos} inscritos</span>
                    </div>
                  )}
                  {turma.vagasDisponiveis !== undefined && turma.vagasTotal !== undefined && (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-blue-600" />
                      <span><strong>Vagas disponíveis:</strong> {turma.vagasDisponiveis} / {turma.vagasTotal}</span>
                    </div>
                  )}
                  {turma.local && ( 
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
                      <span><strong>Local:</strong> {turma.local}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisciplinasProfessor;