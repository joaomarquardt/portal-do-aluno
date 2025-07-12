import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Calendar, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ComunicadoServ {
  id: number;
  titulo: string;
  mensagem: string;
  dataPublicacao: string;
}

const DashboardAluno = () => {
  const { user, logout, changePassword } = useAuth();
  const [novaSenha, setNovaSenha] = useState('');
  const [trocaSucesso, setTrocaSucesso] = useState(false);
  const [erroTrocaSenha, setErroTrocaSenha] = useState('');

  const [disciplinasAtivas, setDisciplinasAtivas] = useState(0);
  const [mediaGeral, setMediaGeral] = useState(0.0);
  const [presencaPorcentagem, setPresencaPorcentagem] = useState('0%');
  const [comunicados, setComunicados] = useState<ComunicadoServ[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_URL_API;

  useEffect(() => {
    if (!apiUrl) {
      setErrorDashboard("Erro: Configuração da API ausente. Contate o suporte.");
      setLoading(false);
      return;
    }

    if (!user || !user.idAluno) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setErrorDashboard(null);

        const summaryResponse = await axios.get(`${apiUrl}/alunos/${user.idAluno}/sumario-dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDisciplinasAtivas(summaryResponse.data.numDisciplinasAtivas);
        setMediaGeral(summaryResponse.data.mediaGeral);
        setPresencaPorcentagem(summaryResponse.data.presencaPorcentagem);

        const announcementsResponse = await axios.get(`${apiUrl}/comunicados`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setComunicados(announcementsResponse.data);
        debugger;
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setErrorDashboard(`Erro do servidor: ${err.response.status} - ${err.response.data.message || 'Erro desconhecido.'}`);
          } else if (err.request) {
            setErrorDashboard("Erro de rede: Não foi possível conectar ao servidor.");
          } else {
            setErrorDashboard('Erro na configuração da requisição.');
          }
        } else {
          setErrorDashboard('Um erro inesperado ocorreu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, apiUrl]);

  const handleTrocarSenha = async () => {
    if (!novaSenha.trim()) {
      setErroTrocaSenha('Digite uma nova senha.');
      return;
    }
    if (!user?.cpf) {
        setErroTrocaSenha('CPF do usuário não disponível.');
        return;
    }

    try {
      const response = await fetch(`${apiUrl}/trocar-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          cpf: user.cpf,
          novaSenha,
        }),
      });

      if (response.ok) {
        setTrocaSucesso(true);
        setErroTrocaSenha('');
        localStorage.setItem('changePassword', 'false');
        window.location.reload();
      } else {
        const data = await response.json();
        setErroTrocaSenha(data?.mensagem || 'Erro ao trocar senha.');
      }
    } catch (e) {
      console.error("Erro de conexão ao trocar senha:", e);
      setErroTrocaSenha('Erro de conexão ao servidor ao tentar trocar a senha.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-lg">Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (errorDashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-700 p-4">
        <p>{errorDashboard}</p>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <p className="text-gray-700 text-lg">Usuário não autenticado. Redirecionando para o login...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Portal do Aluno</h1>
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
            {erroTrocaSenha && <p className="text-red-600 text-sm mb-2">{erroTrocaSenha}</p>}
            {trocaSucesso && <p className="text-green-600 text-sm mb-2">Senha alterada com sucesso!</p>}
            <button
              onClick={handleTrocarSenha}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded"
            >
              Confirmar nova senha
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Disciplinas</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{disciplinasAtivas}</p>
            <p className="text-gray-600 text-sm">Disciplinas ativas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Média Geral</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{mediaGeral.toFixed(2)}</p>
            <p className="text-gray-600 text-sm">Nota média</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Frequência</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{presencaPorcentagem}%</p>
            <p className="text-gray-600 text-sm">Presença média</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Comunicados</h2>
          <div className="space-y-3">
            {comunicados.length > 0 ? (
              comunicados.map((comunicado) => {
                const dataObj = new Date(comunicado.dataPublicacao);
                const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }).format(dataObj);

                return (
                  <div key={comunicado.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="font-semibold text-gray-800 text-sm">{comunicado.titulo}</p>
                    <p className="text-xs text-gray-600">{comunicado.mensagem}</p>
                    <p className="text-xs text-gray-600">{dataFormatada}</p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">Nenhum comunicado no momento.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAluno;
