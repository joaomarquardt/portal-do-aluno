import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TurmaAtiva {
  id: number;
  nomeDisciplina: string;
  codigoTurma: string;
}

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
}

interface TurmaDetalhada {
  id: number;
  alunos: Aluno[];
}

const CadastroNotasPresencas = ({ professorId }: { professorId: number }) => {
  const apiUrl = import.meta.env.VITE_URL_API;
  const {user} = useAuth()
  const [turmas, setTurmas] = useState<TurmaAtiva[]>([]);
  const [expandedTurmas, setExpandedTurmas] = useState<number[]>([]);
  const [alunosPorTurma, setAlunosPorTurma] = useState<Record<number, Aluno[]>>({});
  const [notasPresencas, setNotasPresencas] = useState<Record<string, { media: string; horas: string }>>({});

  useEffect(() => {
    const fetchTurmas = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/professores/${user.idProfessor}/turmas-ativas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTurmas(response.data);
    };

    fetchTurmas();
  }, [user.idProfessor]);

  const toggleTurma = async (turmaId: number) => {
    if (expandedTurmas.includes(turmaId)) {
      setExpandedTurmas((prev) => prev.filter((id) => id !== turmaId));
    } else {
      if (!alunosPorTurma[turmaId]) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/turmas/${turmaId}/alunos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlunosPorTurma((prev) => ({ ...prev, [turmaId]: response.data.alunos }));
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
    const alunos = alunosPorTurma[turmaId];

    for (const aluno of alunos) {
      const key = `${turmaId}-${aluno.id}`;
      const dados = notasPresencas[key];
      if (!dados) continue;
      console.log(dados.media)
      console.log(dados.horas)
      debugger
      await fetch(`${apiUrl}/turmas/${turmaId}/alunos/${aluno.id}`,{
        method:"PUT",
        headers:{
          "Content-type":"Application/json",
          "Authorization":`Bearer ${token}` 
        },
        body:JSON.stringify({
          valor:dados.media,
          horasRegistradas:dados.horas
        })
      })
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Notas e Presenças</h2>

      {turmas.map((turma) => (
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
              {alunosPorTurma[turma.id]?.map((aluno) => {
                const key = `${turma.id}-${aluno.id}`;
                return (
                  <div
                    key={aluno.id}
                    className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200 py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{aluno.nome}</p>
                      <p className="text-sm text-gray-500">Matrícula: {aluno.matricula}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Média</label>
                        <input
                          type="number"
                          value={notasPresencas[key]?.media || ''}
                          onChange={(e) => handleInputChange(turma.id, aluno.id, 'media', e.target.value)}
                          className="px-3 py-2 border rounded w-24"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-600">Horas</label>
                        <input
                          type="number"
                          value={notasPresencas[key]?.horas || ''}
                          onChange={(e) => handleInputChange(turma.id, aluno.id, 'horas', e.target.value)}
                          className="px-3 py-2 border rounded w-24"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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
      ))}
    </div>
  );
};

export default CadastroNotasPresencas;
