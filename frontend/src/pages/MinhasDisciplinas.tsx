import { BookOpen, Users, Calendar, Hash, Clock, CheckCircle } from 'lucide-react';

interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  horario: string;
  vagasTotal: number;
  vagasDisponiveis: number;
  alunosInscritos: number;
  periodoLetivo: string;
  local: string;
}

const disciplinasMock: Disciplina[] = [
  {
    id: 1,
    nome: 'Estrutura de Dados',
    codigo: 'INF101',
    horario: 'Segundas e Quartas - 10:00 às 12:00',
    vagasTotal: 40,
    vagasDisponiveis: 12,
    alunosInscritos: 28,
    periodoLetivo: '2025.1',
    local: 'Sala 302 - Bloco B',
  },
  {
    id: 2,
    nome: 'Programação Web',
    codigo: 'INF202',
    horario: 'Terças e Quintas - 14:00 às 16:00',
    vagasTotal: 30,
    vagasDisponiveis: 5,
    alunosInscritos: 25,
    periodoLetivo: '2025.1',
    local: 'Lab 3 - Bloco C',
  },
];

const DisciplinasProfessor = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Minhas Disciplinas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disciplinasMock.map((disciplina) => (
            <div
              key={disciplina.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                  <BookOpen size={20} /> {disciplina.nome}
                </h3>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Hash size={16} /> {disciplina.codigo}
                </span>
              </div>

              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span><strong>Período:</strong> {disciplina.periodoLetivo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  <span><strong>Horário:</strong> {disciplina.horario}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  <span><strong>Alunos:</strong> {disciplina.alunosInscritos} inscritos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-blue-600" />
                  <span><strong>Vagas disponíveis:</strong> {disciplina.vagasDisponiveis} / {disciplina.vagasTotal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
                  <span><strong>Local:</strong> {disciplina.local}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisciplinasProfessor;
