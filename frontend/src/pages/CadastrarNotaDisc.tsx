import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TurmaAtiva {
  id: number;
  nomeDisciplina: string;
  codigoTurma: string;
  cargaHoraria: number;
}

interface AlunoTurmaDetalhe {
  id: number;
  nome: string;
  matricula: string;
  cpf: string;
  emailPessoal: string;
  emailInstitucional: string;
  telefone: string;
  periodoAtual: number;
  periodoIngresso: string;
  media: number;
  horasRegistradas: number;
}

const CadastroNotasPresencas = ({ professorId }: { professorId: number }) => {
  const apiUrl = import.meta.env.VITE_URL_API;
  const { user } = useAuth();
  const [turmas, setTurmas] = useState<TurmaAtiva[]>([]);
  const [expandedTurmas, setExpandedTurmas] = useState<number[]>([]);
  const [alunosPorTurma, setAlunosPorTurma] = useState<Record<number, AlunoTurmaDetalhe[]>>({});
  const [notasPresencas, setNotasPresencas] = useState<Record<string, { media: string; horas: string }>>({});

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado');
        const response = await axios.get(`${apiUrl}/professores/${user.idProfessor}/turmas-ativas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurmas(response.data);
      } catch (error) {
        console.error("Erro ao buscar turmas ativas:", error);
      }
    };

    if (user?.idProfessor) {
      fetchTurmas();
    }
  }, [user?.idProfessor, apiUrl]);

  const toggleTurma = async (turmaId: number) => {
    if (expandedTurmas.includes(turmaId)) {
      setExpandedTurmas((prev) => prev.filter((id) => id !== turmaId));
    } else {
      if (!alunosPorTurma[turmaId] || alunosPorTurma[turmaId].length === 0) {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('Token não encontrado');
          const response = await axios.get<AlunoTurmaDetalhe[]>(`${apiUrl}/turmas/${turmaId}/alunos`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          debugger;
          const fetchedAlunos: AlunoTurmaDetalhe[] = response.data;
          setAlunosPorTurma((prev) => ({ ...prev, [turmaId]: fetchedAlunos }));

          const initialNotasPresencasForTurma: Record<string, { media: string; horas: string }> = {};
          fetchedAlunos.forEach(aluno => {
            const key = `${turmaId}-${aluno.id}`;
            initialNotasPresencasForTurma[key] = {
              media: aluno.media !== null && aluno.media !== undefined ? String(aluno.media) : '',
              horas: aluno.horasRegistradas !== null && aluno.horasRegistradas !== undefined ? String(aluno.horasRegistradas) : '',
            };
          });
          setNotasPresencas(prev => ({ ...prev, ...initialNotasPresencasForTurma }));

        } catch (error) {
          console.error(`Erro ao buscar alunos da turma ${turmaId}:`, error);
          setAlunosPorTurma((prev) => ({ ...prev, [turmaId]: [] }));
        }
      }
      setExpandedTurmas((prev) => [...prev, turmaId]);
    }
  };

  const handleInputChange = (
    turmaId: number,
    alunoId: number,
    field: 'media' | 'horas',
    value: string
  ) => {
    const key = `${turmaId}-${alunoId}`;
    setNotasPresencas((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSalvar = async (turmaId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      return;
    }
    const alunos = alunosPorTurma[turmaId];

    if (!alunos || alunos.length === 0) {
      alert('Nenhum aluno para salvar nesta turma.');
      return;
    }

    let successCount = 0;
    let errorMessages: string[] = [];
    for (const aluno of alunos) {
      const key = `${turmaId}-${aluno.id}`;
      const dados = notasPresencas[key];

      if (dados && (dados.media !== '' || dados.horas !== '')) {
        try {
          const res = await fetch(`${apiUrl}/turmas/${turmaId}/alunos/${aluno.id}`, {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              valor: dados.media !== '' ? parseFloat(dados.media) : null,
              horasRegistradas: dados.horas !== '' ? parseInt(dados.horas) : null
            })
          });

          if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ message: 'Erro desconhecido ao salvar.' }));
            errorMessages.push(`Falha ao salvar ${aluno.nome}: ${errorBody.message || res.statusText}`);
          } else {
            successCount++;
            setAlunosPorTurma(prev => {
                const updatedTurmaAlunos = prev[turmaId].map(a =>
                    a.id === aluno.id ? {
                        ...a,
                        media: dados.media !== '' ? parseFloat(dados.media) : null,
                        horasRegistradas: dados.horas !== '' ? parseInt(dados.horas) : null
                    } : a
                );
                return {...prev, [turmaId]: updatedTurmaAlunos};
            });
            setNotasPresencas(prev => {
                const newPrev = {...prev};
                delete newPrev[key];
                return newPrev;
            });
          }
        } catch (fetchError: any) {
          console.error(`Erro de rede/conexão ao salvar ${aluno.nome}:`, fetchError);
          errorMessages.push(`Erro de conexão para ${aluno.nome}: ${fetchError.message || 'Sem resposta.'}`);
        }
      }
    }

    if (errorMessages.length > 0) {
      alert(`Erro(s) ao salvar: ${errorMessages.join('\n')}`);
    } else if (successCount > 0) {
      alert(`Dados de ${successCount} aluno(s) salvos com sucesso na turma ${turmaId}!`);
    } else {
      alert('Nenhum dado foi alterado ou preenchido para salvar.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Notas e Presenças</h2>

      {turmas.length === 0 ? (
        <div className="text-center text-gray-600 py-8">Nenhuma turma ativa encontrada para o professor.</div>
      ) : (
        turmas.map((turma) => (
          <div key={turma.id} className="mb-6 bg-white rounded shadow border border-gray-200">
            <button
              className="w-full text-left p-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200"
              onClick={() => toggleTurma(turma.id)}
            >
              <div>
                <p className="text-lg font-semibold text-blue-700">{turma.nomeDisciplina}</p>
                <p className="text-sm text-gray-500">Código da Turma: {turma.codigoTurma}</p>
              </div>
              {expandedTurmas.includes(turma.id) ? <ChevronUp /> : <ChevronDown />}
            </button>

            {expandedTurmas.includes(turma.id) && (
              <div className="p-4">
                {alunosPorTurma[turma.id]?.length === 0 ? (
                  <div className="text-center text-gray-600 py-4">Nenhum aluno nesta turma.</div>
                ) : (
                  alunosPorTurma[turma.id]?.map((aluno) => {
                    const key = `${turma.id}-${aluno.id}`;
                    const currentMedia = notasPresencas[key]?.media ?? (aluno.media !== null && aluno.media !== undefined ? String(aluno.media) : '');
                    const currentHoras = notasPresencas[key]?.horas ?? (aluno.horasRegistradas !== null && aluno.horasRegistradas !== undefined ? String(aluno.horasRegistradas) : '');

                    return (
                      <div
                        key={aluno.id}
                        className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 py-2 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{aluno.nome}</p>
                          <p className="text-sm text-gray-500">Matrícula: {aluno.matricula}</p>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <label htmlFor={`media-${key}`} className="text-sm text-gray-600">Média</label>
                            <input
                              id={`media-${key}`}
                              type="number"
                              step="0.1"
                              min="0" max="10"
                              value={currentMedia}
                              onChange={(e) => handleInputChange(turma.id, aluno.id, 'media', e.target.value)}
                              className="px-3 py-2 border rounded w-24"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor={`horas-${key}`} className="text-sm text-gray-600">Horas</label>
                            <input
                              id={`horas-${key}`}
                              type="number"
                              min="0" max={turma.cargaHoraria}
                              value={currentHoras}
                              onChange={(e) => handleInputChange(turma.id, aluno.id, 'horas', e.target.value)}
                              className="px-3 py-2 border rounded w-24"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleSalvar(turma.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={18} /> Salvar Turma
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CadastroNotasPresencas;
