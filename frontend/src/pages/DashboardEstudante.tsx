
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Calendar, Award } from 'lucide-react';

const DashboardEstudante = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Portal do Estudante</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Disciplinas</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">8</p>
            <p className="text-gray-600 text-sm">Disciplinas ativas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Média Geral</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">8.5</p>
            <p className="text-gray-600 text-sm">Nota média</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Frequência</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">92%</p>
            <p className="text-gray-600 text-sm">Presença média</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Próximas Aulas</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <div>
                  <p className="font-semibold text-gray-800">Matemática</p>
                  <p className="text-sm text-gray-600">Prof. João Silva</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">14:00</p>
                  <p className="text-xs text-gray-600">Sala 201</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <div>
                  <p className="font-semibold text-gray-800">História</p>
                  <p className="text-sm text-gray-600">Prof. Maria Santos</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">16:00</p>
                  <p className="text-xs text-gray-600">Sala 105</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Comunicados</h2>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="font-semibold text-gray-800 text-sm">Reunião de Pais</p>
                <p className="text-xs text-gray-600">Sexta-feira, 15/12 às 19h</p>
              </div>
              <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="font-semibold text-gray-800 text-sm">Prova de Matemática</p>
                <p className="text-xs text-gray-600">Segunda-feira, 18/12 às 14h</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardEstudante;
