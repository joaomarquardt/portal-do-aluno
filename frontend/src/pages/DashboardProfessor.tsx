
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Users, Calendar } from 'lucide-react';

const DashboardProfessor = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Portal do Professor</h1>
            <p className="text-gray-600">Bem-vindo, {user?.nome}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Minhas Turmas</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-gray-600 text-sm">Turmas ativas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Alunos</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">120</p>
            <p className="text-gray-600 text-sm">Total de alunos</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Aulas Hoje</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">3</p>
            <p className="text-gray-600 text-sm">Aulas programadas</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Funcionalidades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Gerenciar Turmas</h3>
              <p className="text-gray-600 text-sm mb-3">Visualize e gerencie suas turmas</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Acessar
              </button>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Notas e Frequência</h3>
              <p className="text-gray-600 text-sm mb-3">Registre notas e frequência dos alunos</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Acessar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardProfessor;
