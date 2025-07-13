import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
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

interface SumarioDashboard {
  numDisciplinasAtivas: number;
  mediaGeral: number;
  presencaPorcentagem: string;
}

// NOVO: Adicionado tipo para os erros do formulário de troca de senha
interface TrocaSenhaErrors {
  senhaAtual?: string;
  novaSenha?: string;
  submit?: string;
}

const TrocaSenhaCard = ({
  senhaAtual,
  novaSenha,
  setSenhaAtual,
  setNovaSenha,
  erroTrocaSenha, // Este erro é um erro geral, mantido para compatibilidade
  trocaSucesso,
  handleTrocarSenha,
  errors, // NOVO: Prop para passar os erros de validação granular
  handleInputChange // NOVO: Prop para lidar com a mudança nos inputs
}: {
  senhaAtual: string;
  novaSenha: string;
  setSenhaAtual: (value: string) => void;
  setNovaSenha: (value: string) => void;
  erroTrocaSenha: string; // Erro geral de submit, pode ser usado para API
  trocaSucesso: boolean;
  handleTrocarSenha: () => void;
  errors: TrocaSenhaErrors; // Tipagem para os erros
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Tipagem para o handler
}) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded mb-6 shadow-md">
    <h2 className="text-lg font-bold mb-2">Você precisa alterar sua senha</h2>
    <p className="mb-4">Por favor, digite uma nova senha para continuar utilizando o sistema.</p>
    <div>
      <input
        type="password"
        name="senhaAtual" // Adicionado name para o handleInputChange
        placeholder="Senha Atual *"
        className={`w-full p-2 border rounded mb-1 ${errors.senhaAtual ? 'border-red-500' : 'border-gray-300'}`}
        value={senhaAtual}
        onChange={handleInputChange}
        required
      />
      {errors.senhaAtual && <p className="text-red-600 text-xs mb-2">{errors.senhaAtual}</p>}
    </div>
    <div>
      <input
        type="password"
        name="novaSenha" // Adicionado name
        placeholder="Nova senha *"
        className={`w-full p-2 border rounded mb-1 ${errors.novaSenha ? 'border-red-500' : 'border-gray-300'}`}
        value={novaSenha}
        onChange={handleInputChange}
        required
      />
      {errors.novaSenha && <p className="text-red-600 text-xs mb-2">{errors.novaSenha}</p>}
    </div>
    {/* erroTrocaSenha é para erros de API, errors.submit é para erros de validação local ou API mais geral */}
    {(erroTrocaSenha || errors.submit) && <p className="text-red-600 text-sm mb-2">{erroTrocaSenha || errors.submit}</p>}
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
  const [erroTrocaSenha, setErroTrocaSenha] = useState(''); // Erro de API para troca de senha
  const [trocaSucesso, setTrocaSucesso] = useState(false);
  const [trocaSenhaErrors, setTrocaSenhaErrors] = useState<TrocaSenhaErrors>({}); // NOVO: Erros de validação local para a troca de senha

  const [disciplinasAtivas, setDisciplinasAtivas] = useState(0);
  const [mediaGeral, setMediaGeral] = useState(0.0);
  const [presencaPorcentagem, setPresencaPorcentagem] = useState('0%');
  const [comunicados, setComunicados] = useState<ComunicadoServ[]>([]);
  const [turmas, setTurmas] = useState<TurmaServ[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorDashboard, setErrorDashboard] = useState<string | null>(null);
  const [mostrarDisciplina, setMostrarDisciplina] = useState(false);

  // NOVO: Função de validação para o formulário de troca de senha
  const validateTrocaSenhaForm = useCallback(() => {
    let newErrors: TrocaSenhaErrors = {};
    let isValid = true;

    if (!senhaAtual.trim()) {
      newErrors.senhaAtual = 'A senha atual é obrigatória.';
      isValid = false;
    }
    if (!novaSenha.trim()) {
      newErrors.novaSenha = 'A nova senha é obrigatória.';
      isValid = false;
    } else if (novaSenha.length < 6) { // Exemplo de comprimento mínimo
      newErrors.novaSenha = 'A nova senha deve ter pelo menos 6 caracteres.';
      isValid = false;
    }

    setTrocaSenhaErrors(newErrors);
    return isValid;
  }, [senhaAtual, novaSenha]);

  // NOVO: Handler genérico para os inputs do TrocaSenhaCard
  const handleTrocaSenhaInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'senhaAtual') {
      setSenhaAtual(value);
    } else if (name === 'novaSenha') {
      setNovaSenha(value);
    }

    // Limpa o erro do campo assim que o usuário começa a digitar
    if (trocaSenhaErrors[name as keyof TrocaSenhaErrors]) {
      setTrocaSenhaErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name as keyof TrocaSenhaErrors];
        return updatedErrors;
      });
    }
    setErroTrocaSenha(''); // Limpa o erro geral de API ao digitar
    setTrocaSucesso(false); // Limpa o sucesso ao digitar
  }, [trocaSenhaErrors]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get<SumarioDashboard>(`${apiUrl}/alunos/${user?.idAluno}/sumario-dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDisciplinasAtivas(data.numDisciplinasAtivas);
        setMediaGeral(data.mediaGeral);
        setPresencaPorcentagem(data.presencaPorcentagem);

        const comunicadosRes = await axios.get<ComunicadoServ[]>(`${apiUrl}/comunicados`, {
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

    const fetchTurmasInscritas = async () => {
      try {
        if (!user?.idAluno) return; // Garante que idAluno existe

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

    if (user?.idAluno && apiUrl) {
      fetchDashboardData();
      fetchTurmasInscritas(); // Chama aqui também, dentro do useEffect
    } else {
      setLoading(false);
    }
  }, [user, apiUrl]); // Dependências do useEffect

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const res = await axios.get<TurmaServ[]>(`${apiUrl}/turmas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const turmasTratadas = res.data.map((turma) => ({
          ...turma,
          professor: turma.professor || 'Desconhecido' // Assume que 'professor' pode vir direto como string ou nulo
        }));
        setTurmas(turmasTratadas);
      } catch (err) {
        console.error('Erro ao buscar turmas:', err);
      }
    };
    fetchTurmas();
  }, [apiUrl]);

  const handleTrocarSenhaSubmit = async () => { // Renomeado para evitar conflito com a prop
    // Primeiramente, validação local
    if (!validateTrocaSenhaForm()) {
      return; // Interrompe se a validação local falhar
    }

    if (!user?.idAluno) {
      setErroTrocaSenha('ID do aluno não encontrado.');
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/auth/${user.idAluno}/senha`, {
        senhaAtual,
        novaSenha
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.status === 200) {
        setTrocaSucesso(true);
        setErroTrocaSenha(''); // Limpa erro de API
        setTrocaSenhaErrors({}); // Limpa erros de validação local
        localStorage.setItem('changePassword', 'false');
        // Uma recarga completa pode ser desejável para re-inicializar o estado de autenticação
        window.location.reload();
      }
    } catch (err: any) {
      // Captura e exibe erros da API
      const errorMessage = err?.response?.data?.message || err?.response?.data?.mensagem || 'Erro ao trocar senha. Verifique sua senha atual.';
      setErroTrocaSenha(errorMessage);
      setTrocaSucesso(false);
    }
  };

  const handleInscrever = async (turmaId: number) => {
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
        body: JSON.stringify({ idAlunos: [user.idAluno] })
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(`Erro ao se inscrever: ${erro?.mensagem || "erro desconhecido"}`);
        return;
      }

      alert("Inscrição realizada com sucesso!");

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
            handleTrocarSenha={handleTrocarSenhaSubmit} // Usando o novo handler
            errors={trocaSenhaErrors} // Passando os erros de validação
            handleInputChange={handleTrocaSenhaInputChange} // Passando o handler de input
          />
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InfoCard icon={<BookOpen className="text-blue-600" />} title="Disciplinas Ativas" value={disciplinasAtivas} />
          <InfoCard icon={<Award className="text-green-600" />} title="Média Geral (CR)" value={mediaGeral.toFixed(2)} />
          <InfoCard icon={<Calendar className="text-purple-600" />} title="Frequência Total" value={`${presencaPorcentagem}%`} />
        </div>

        {/* Comunicados */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Comunicados</h2>
          {comunicados.length > 0 ? comunicados.map((c) => (
            <div key={c.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-2">
              <p className="font-semibold">{c.titulo}</p>
              <p className="text-sm">{c.mensagem}</p>
              <p className="text-xs text-gray-500">{new Date(c.dataPublicacao).toLocaleString('pt-BR')}</p>
            </div>
          )) : <p className="text-gray-600">Nenhum comunicado.</p>}
        </div>

        {/* Turmas */}
        <section className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="text-purple-600" size={32} />
              <div>
                <h1 className="text-xl font-bold">Inscrição em Turmas</h1>
                <p className="text-sm text-gray-600">Escolha uma disciplina para se inscrever</p>
              </div>
            </div>
            <button onClick={() => setMostrarDisciplina(!mostrarDisciplina)} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              {mostrarDisciplina ? "Ocultar Turmas" : "Ver Turmas Disponíveis"}
            </button>
          </div>

          {mostrarDisciplina && (
            turmas.length === 0 ? (
              <div className="text-center text-gray-600 py-8">Nenhuma turma disponível para inscrição.</div>
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
                      Período mínimo para se inscrever: {turma.disciplina.periodo}º
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