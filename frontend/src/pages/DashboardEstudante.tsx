import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Calendar, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
require("dotenv").config();
interface ComunicadoServ {
  id: number;
  titulo: string;
  mensagem: string;
  data: string;
}

const DashboardEstudante = () => {
  const { user, logout, changePassword } = useAuth();
  const [ComunicadosServ, setComunicadosServ] = useState<ComunicadoServ[]>([]);
  const [novaSenha, setNovaSenha] = useState('');
  const [trocaSucesso, setTrocaSucesso] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchComunicados = async () => {
      try {
        const response = await fetch(`http://localhost:3000/comunicados`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar comunicados: ${response.status}`);
        }

        const data: ComunicadoServ[] = await response.json();
        setComunicadosServ(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComunicados();
  }, []);

  const handleTrocarSenha = async () => {
    if (!novaSenha.trim()) {
      setErro('Digite uma nova senha.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/trocar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cpf: user?.cpf,
          novaSenha,
        }),
      });

      if (response.ok) {
        setTrocaSucesso(true);
        setErro('');
        localStorage.setItem('changePassword', 'false');
        window.location.reload(); // recarrega a página para refletir mudança
      } else {
        const data = await response.json();
        setErro(data?.mensagem || 'Erro ao trocar senha.');
      }
    } catch (e) {
      setErro('Erro de conexão.');
    }
  };

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
        {changePassword && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded mb-6 shadow-md">
            <h2 className="text-lg font-bold mb-2">Você precisa alterar sua senha</h2>
            <p className="mb-4">Por favor, digite uma nova senha para continuar utilizando o sistema.</p>
            <input
              type="password"
              placeholder="Nova senha"
              className="w-full p-2 border rounded mb-2"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}
            {trocaSucesso && <p className="text-green-600 text-sm mb-2">Senha alterada com sucesso!</p>}
            <button
              onClick={handleTrocarSenha}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded"
            >
              Confirmar nova senha
            </button>
          </div>
        )}

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Comunicados */}
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
            <div className="space-y-3">
              {ComunicadosServ.map(({ id, titulo, mensagem, data }) => (
                <div key={id} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800">{titulo}</h4>
                      <p className="text-gray-600 mt-1">{mensagem}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Administração - {new Date(data + 'Z').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardEstudante;
