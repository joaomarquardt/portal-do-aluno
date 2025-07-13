import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LogOut, BookOpen, Calendar, Award, User as UserIcon, Clock
} from 'lucide-react';

interface ComunicadoServ {
  id: number;
  titulo: string;
  mensagem: string;
  dataPublicacao: string;
}

interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
  periodo: number;
  cargaHoraria: number;
}

interface TurmaServ {
  id: number;
  codigo: string;
  horario: string;
  periodo: string;
  vagasTotais: number;
  professor: string;
  disciplina: Disciplina;
}

const TrocaSenhaCard = ({
  senhaAtual,
  novaSenha,
  setSenhaAtual,
  setNovaSenha,
  erroTrocaSenha,
  trocaSucesso,
  handleTrocarSenha
}: any) => (
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
);

const DashboardAluno = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_URL_API;
  const [turmasInscritas, setTurmasInscritas] = useState<Set<number>>(new Set());

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [erroTrocaSenha, setErroTrocaSenha] = useState('');
  const [trocaSucesso, setTrocaSucesso] = useState(false);

  const [disciplinasAtivas, setDisciplinasAtivas] = useState(0);
  const [mediaGeral, setMediaGeral] = useState(0.0);
  const [presencaPorcentagem, setPresencaPorcentagem] = useState('0%');
  const [comunicados, setComunicados] = useState<ComunicadoServ[]>([]);
  const [turmas, setTurmas] = useState<TurmaServ[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState<string | null>(null);
  const [mostrarDisciplina, setMostrarDisciplina] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/alunos/${user?.idAluno}/sumario-dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDisciplinasAtivas(data.numDisciplinasAtivas);
        setMediaGeral(data.mediaGeral);
        setPresencaPorcentagem(data.presencaPorcentagem);

        const comunicadosRes = await axios.get(`${apiUrl}/comunicados`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setComunicados(comunicadosRes.data);
      } catch (err) {
        console.error('Erro no dashboard:', err);
        setErrorDashboard('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.idAluno && apiUrl) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
     const fetchTurmasInscritas = async () => {
    try {
      const response = await fetch(`${apiUrl}/alunos/${user.idAluno}/turmas`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (!response.ok) throw new Error("Erro ao buscar turmas inscritas.");

      const data: TurmaServ[] = await response.json();
      const ids = data.map(t => t.id);
      setTurmasInscritas(new Set(ids));
    } catch (err) {
      console.error("Erro ao buscar turmas já inscritas:", err);
    }
  };
  }, [user, apiUrl]);

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const res = await axios.get(`${apiUrl}/turmas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const turmasTratadas = res.data.map((turma: any) => ({
          ...turma,
          professor: turma.professor?.nome || 'Desconhecido'
        }));
        console.log(turmasTratadas)
        setTurmas(turmasTratadas);
      } catch (err) {
        console.error('Erro ao buscar turmas:', err);
      }
    };
    fetchTurmas();
  }, [apiUrl]);

  const handleTrocarSenha = async () => {
    if (!novaSenha.trim()) return setErroTrocaSenha('Digite uma nova senha.');
    if (!user?.idAluno) return setErroTrocaSenha('ID do aluno não encontrado.');

    try {
      const res = await axios.post(`${apiUrl}/auth/${user.idAluno}/senha`, {
        senhaAtual,
        novaSenha
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.status === 200) {
        setTrocaSucesso(true);
        setErroTrocaSenha('');
        localStorage.setItem('changePassword', 'false');
        window.location.reload();
      }
    } catch (err: any) {
      setErroTrocaSenha(err?.response?.data?.mensagem || 'Erro ao trocar senha.');
    }
  };

const handleInscrever = async (turmaId: number) => {
  console.log(user.idUsuario)
  if (!user?.idUsuario) {
    alert("Usuário não autenticado.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/turmas/${turmaId}/alunos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ idAlunos:[user.idAluno] }) // ou remova se a API não exige
    });
    console.log(user)
    if (!response.ok) {
      const erro = await response.json();
      alert(`Erro ao se inscrever: ${erro?.mensagem || "erro desconhecido"}`);
      return;
    }

    alert("Inscrição realizada com sucesso!");

    // Atualiza o set de turmas inscritas
    setTurmasInscritas(prev => new Set(prev).add(turmaId));

  } catch (err) {
    console.error("Erro ao se inscrever:", err);
    alert("Erro de conexão ao tentar se inscrever.");
  }
};


  if (loading) return <div className="min-h-screen flex justify-center items-center">Carregando...</div>;
  if (errorDashboard) return <div className="text-red-600 p-6">{errorDashboard}</div>;
  if (!user) return <div className="text-center p-6">Usuário não autenticado. Redirecionando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b shadow-sm p-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Portal do Aluno</h1>
          <p className="text-sm text-gray-600">Bem-vindo, {user.nome}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/meu-perfil/editar')} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600">
            <UserIcon size={16} /> Perfil
          </button>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-600">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <main className="p-6">
        {changePassword && (
          <TrocaSenhaCard
            senhaAtual={senhaAtual}
            novaSenha={novaSenha}
            setSenhaAtual={setSenhaAtual}
            setNovaSenha={setNovaSenha}
            erroTrocaSenha={erroTrocaSenha}
            trocaSucesso={trocaSucesso}
            handleTrocarSenha={handleTrocarSenha}
          />
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard icon={<BookOpen className="text-blue-600" />} title="Disciplinas" value={disciplinasAtivas} />
          <InfoCard icon={<Award className="text-green-600" />} title="Média Geral" value={mediaGeral.toFixed(2)} />
          <InfoCard icon={<Calendar className="text-purple-600" />} title="Frequência" value={`${presencaPorcentagem}%`} />
        </div>

        {/* Comunicados */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Comunicados</h2>
          {comunicados.length > 0 ? comunicados.map((c) => (
            <div key={c.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-2">
              <p className="font-semibold">{c.titulo}</p>
              <p className="text-sm">{c.mensagem}</p>
              <p className="text-xs text-gray-500">{new Date(c.dataPublicacao).toLocaleString()}</p>
            </div>
          )) : <p className="text-gray-600">Nenhum comunicado.</p>}
        </div>

        {/* Turmas */}
        <section className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="text-purple-600" size={32} />
              <div>
                <h1 className="text-xl font-bold">Inscrição em turmas</h1>
                <p className="text-sm text-gray-600">Escolha uma disciplina</p>
              </div>
            </div>
            <button onClick={() => setMostrarDisciplina(!mostrarDisciplina)} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              {mostrarDisciplina ? "Ocultar" : "Entrar em disciplina"}
            </button>
          </div>

          {mostrarDisciplina && (
            turmas.length === 0 ? (
              <div className="text-center text-gray-600 py-8">Nenhuma turma disponível.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {turmas.map((turma) => (
                  <div key={turma.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 shadow-md">
                    <h3 className="text-lg font-bold mb-1">
                      TURMA {turma.codigo} - {turma.disciplina.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <Clock className="inline mr-1" size={14} />
                      Horário das aulas: {turma.horario}
                    </p>
                     <p className="text-sm text-gray-600 mb-1">
                
                       Periodo minimo para se inscrever: {turma.disciplina.periodo}º
                    </p>
                    {turmasInscritas.has(turma.id) ? (
                      <button
                        disabled
                        className="mt-3 bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed opacity-70"
                      >
                        Inscrito
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInscrever(turma.id)}
                        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                      >
                        Inscrever-se
                      </button>
                    )}
                  </div>
                  
                ))}
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
};

const InfoCard = ({ icon, title, value }: { icon: JSX.Element, title: string, value: string | number }) => (
  <div className="bg-white p-6 rounded shadow flex flex-col gap-2">
    <div className="flex items-center gap-3">{icon}<h3 className="text-lg font-semibold">{title}</h3></div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default DashboardAluno;
