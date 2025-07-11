

interface Student {
  id: number;
  cpf: string;
  name: string;
  email: string;
  institucionalEmail: string;
  cellphone: string;
  CursoId: number;
}

interface StatsProps {
  students: Student[];
}

const Stats = ({ students }: StatsProps) => {
  const totalStudents = students.length;
  const averageGPA = students.length > 0 
    ? (students.reduce((sum, student) => sum + 1, 0) / students.length).toFixed(2)
    : '0.00';
  
  // const yearCounts = students.reduce((acc, student) => {
  //   acc[student.year] = (acc[student.year] || 0) + 1;
  //   return acc;
  // }, {} as Record<string, number>);

  const highPerformers = students.filter(student => 1 >= 3.5).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
        <h3 className="text-blue-800 font-bold text-lg">Total de Estudantes</h3>
        <p className="text-2xl font-bold text-blue-900">{totalStudents}</p>
      </div>
      
      <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
        <h3 className="text-green-800 font-bold text-lg">CRA Médio</h3>
        <p className="text-2xl font-bold text-green-900">{averageGPA}</p>
      </div>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
        <h3 className="text-yellow-800 font-bold text-lg">Alto Desempenho</h3>
        <p className="text-2xl font-bold text-yellow-900">{highPerformers}</p>
        <p className="text-xs text-yellow-700">CRA ≥ 3.5</p>
      </div>
      
      <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded shadow">
        <h3 className="text-purple-800 font-bold text-lg">Período Mais Comum</h3>
        <p className="text-2xl font-bold text-purple-900">
          {/* {Object.keys(yearCounts).length > 0 
            ? Object.entries(yearCounts).sort(([,a], [,b]) => b - a)[0][0] 
            : 'N/A'} */}
        </p>
      </div>
    </div>
  );
};

export default Stats;
