

interface Aluno {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  emailInstitucional: string;
  telefone: string;
  CursoId: number;
}

interface StatsProps {
  totalAlunosGlobal: number;
  alunosNaPagina: Aluno[];
  crMedio?: number;
  numAlunosAltoDesempenho?: number;
  periodoMaisComum?: number;
}

const Stats = ({ totalAlunosGlobal, alunosNaPagina, crMedio, numAlunosAltoDesempenho, periodoMaisComum }: StatsProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
        <h3 className="text-blue-800 font-bold text-lg">Total de Alunos</h3>
        <p className="text-2xl font-bold text-blue-900">{totalAlunosGlobal}</p>
      </div>

      <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
        <h3 className="text-green-800 font-bold text-lg">CR Médio</h3>
        <p className="text-2xl font-bold text-green-900">{crMedio !== null ? crMedio.toFixed(2) : 'Carregando...'}</p>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
        <h3 className="text-yellow-800 font-bold text-lg">Alto Desempenho</h3>
        <p className="text-2xl font-bold text-yellow-900">{numAlunosAltoDesempenho !== null ? numAlunosAltoDesempenho : 'Carregando...'}</p>
        <p className="text-xs text-yellow-700">CR ≥ 8.5</p>
      </div>

      <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded shadow">
        <h3 className="text-purple-800 font-bold text-lg">Período Mais Comum</h3>
        <p className="text-2xl font-bold text-purple-900">{periodoMaisComum !== null ? periodoMaisComum : 'Carregando...'}</p>
        <p className="text-2xl font-bold text-purple-900">
        </p>
      </div>
    </div>
  );
};

export default Stats;
