import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Users, Edit, Trash2, Plus, Clock } from "lucide-react";
import { useEffect, useState, useCallback } from 'react';
import { LogOut, BookOpen, Calendar, Award} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ComunicadoServ {
  id: number;
  titulo: string;
  mensagem: string;
  dataPublicacao: string;
}

interface Turma {
  id: number;
  nome: string;
  disciplina: string;
  professor: string;
  alunos: number;
  semestre: string;
  horario: string;
  sala: string;
}

// interface TurmaServ {
//   id: number;
//   codigo: string;
//   horario: string;
//   periodo: string;
//   vagasTotais: number;
//   professor: string;
//   disciplina: Disciplina;
// }

// interface Disciplina {
//   id: number;
//   codigo: string;
//   nome: string;
//   periodo: number;
//   cargaHoraria: number;
// }

const DashboardAluno = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [senhaNova, setSenhaNova] = useState('');
  const [trocaSucesso, setTrocaSucesso] = useState(false);
  const [erroTrocaSenha, setErroTrocaSenha] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('')

  const [disciplinasAtivas, setDisciplinasAtivas] = useState(0);
  const [mediaGeral, setMediaGeral] = useState(0.0);
  const [presencaPorcentagem, setPresencaPorcentagem] = useState('0%');
  const [comunicados, setComunicados] = useState<ComunicadoServ[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState<string | null>(null);
  // const [turmas, setTurmas] = useState<TurmaServ[]>([])
  const [turmasInscritas, setTurmasInscritas] = useState<Set<number>>(new Set());
  const apiUrl = import.meta.env.VITE_URL_API;

  const [mostrarDisciplina, setMostrarDisciplina] = useState(false)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorDashboard(null);

      if (!apiUrl) {
        setErrorDashboard("Erro: Configuração da API ausente. Contate o suporte.");
        setLoading(false);
        return;
      }

      if (!user || !user.idAluno) {
        setErrorDashboard("Usuário não autenticado ou ID de aluno ausente.");
        setLoading(false);
        return;
      }

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
    } catch (err: any) {
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
  }, [user, apiUrl])


  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  const handleTrocarSenha = async () => {
    if (!senhaNova.trim()) {
      setErroTrocaSenha('Digite uma nova senha.');
      return;
    }

    if (!user?.cpf) {
      setErroTrocaSenha('CPF do usuário não disponível.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/${user.idUsuario}/senha`, {
        method: 'PUT',
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          senhaAtual: senhaAtual,
          senhaNova: senhaNova,
        }),
      });
      if (response.ok) {
        setTrocaSucesso(true);
        setErroTrocaSenha('');
        localStorage.setItem('changePassword', 'false');
        window.location.reload();
      } else {
        let data;
        try {
          data = await response.json();
        } catch {
          data = null;
        }
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
      <main className="p-6">
        {changePassword && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded mb-6 shadow-md">
            <h2 className="text-lg font-bold mb-2">Você precisa alterar sua senha</h2>
            <p className="mb-4">Por favor, digite uma nova senha para continuar utilizando o sistema.</p>
             <input
              type="password"
              placeholder="Senha Atual"
              className="w-full p-2 border rounded mb-2"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nova senha"
              className="w-full p-2 border rounded mb-2"
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
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
  );
};

export default DashboardAluno;
