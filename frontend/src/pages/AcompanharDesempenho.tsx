import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  Clock,
  User,
  Hash,
  BarChart2,
  PieChart,
} from 'lucide-react';

interface TurmaAluno {
  id: number;
  nome: string;
  codigo: string;
  horario: string;
  professor: string;
  periodo: string;
  media: number;
  frequencia: number; // porcentagem
}

const turmasInscritasMock: TurmaAluno[] = [
  {
    id: 1,
    nome: 'Programação Orientada a Objetos',
    codigo: 'INF202',
    horario: 'Seg e Qua - 08:00 às 10:00',
    professor: 'Dr. Ana Paula',
    periodo: '2025.1',
    media: 8.5,
    frequencia: 92,
  },
  {
    id: 2,
    nome: 'Banco de Dados I',
    codigo: 'INF203',
    horario: 'Ter e Qui - 10:00 às 12:00',
    professor: 'Prof. Carlos Henrique',
    periodo: '2025.1',
    media: 7.2,
    frequencia: 86,
  },
];

const TurmasAluno = () => {
  const [expanded, setExpanded] = useState<number[]>([]);

  const toggleTurma = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Minhas Turmas</h2>

        <div className="space-y-6">
          {turmasInscritasMock.map((turma) => (
            <div
              key={turma.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => toggleTurma(turma.id)}
                className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
              >
                <div className="flex flex-col text-left">
                  <span className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                    <BookOpen size={20} /> {turma.nome}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Hash size={16} /> {turma.codigo}
                  </span>
                </div>
                {expanded.includes(turma.id) ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              <div className="p-4 space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span><strong>Período:</strong> {turma.periodo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  <span><strong>Horário:</strong> {turma.horario}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-blue-600" />
                  <span><strong>Professor:</strong> {turma.professor}</span>
                </div>
              </div>

              {expanded.includes(turma.id) && (
                <div className="bg-white border-t border-gray-200 p-4 mt-2">
                  <div className="flex flex-col md:flex-row gap-6 text-gray-700">
                    <div className="flex items-center gap-2">
                      <BarChart2 size={20} className="text-green-600" />
                      <span><strong>Média final:</strong> {turma.media.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PieChart size={20} className="text-indigo-600" />
                      <span><strong>Frequência:</strong> {turma.frequencia}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TurmasAluno;
