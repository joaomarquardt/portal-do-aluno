import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen, Users, Calendar, Clock, MapPin } from 'lucide-react'; // Adicione MapPin para Sala

// Interface para Turma (precisa estar completa com todos os campos que a API retorna)
interface Turma {
    id: number;
    nome: string;
    disciplina: string;
    professor: string; // Ou professorId, dependendo de como sua API retorna para o Dashboard
    alunos: number;
    semestre: string;
    horario: string;
    sala: string;
    // Adicione o campo que associa a turma ao professor (ex: professorId, ou siapeDoProfessor)
    // Se a API de turmas retornar o professor completo, você pode usar:
    // professor: { id: number; nome: string; siape: string; ... };
    // Por enquanto, vamos assumir que 'professor' é o nome ou um identificador simples.
    professorSiape?: string; // Campo opcional para o SIAPE do professor, se disponível
}

const DashboardProfessor = () => {
    const { user, logout } = useAuth();
    const [turmasDoProfessor, setTurmasDoProfessor] = useState<Turma[]>([]);
    const [loadingTurmas, setLoadingTurmas] = useState(true);

    // Efeito para buscar as turmas do professor
    useEffect(() => {
        const fetchTurmasDoProfessor = async () => {
            if (!user) { // Garante que há um usuário logado
                setLoadingTurmas(false);
                return;
            }

            setLoadingTurmas(true);
            try {
                // Adapte esta URL e os parâmetros conforme sua API
                // Opção 1: Sua API já retorna turmas por professor logado (melhor)
                const response = await fetch(`http://localhost:3000/turmas/professor/${user.cpf}`, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                // Opção 2: Sua API retorna todas as turmas e você filtra no frontend (menos ideal para grandes volumes)
                // const response = await fetch(`http://localhost:3000/turmas`, { ... headers ... });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar turmas: ${response.status}`);
                }
                const data: Turma[] = await response.json();

                // Se sua API de turmas já retorna SOMENTE as turmas do professor logado:
                setTurmasDoProfessor(data);

                // Se sua API retorna TODAS as turmas e você precisa filtrar pelo SIAPE/CPF do professor:
                // const filteredTurmas = data.filter(turma => turma.professorSiape === user.cpf); // Adapte 'professorSiape'
                // setTurmasDoProfessor(filteredTurmas);

            } catch (error: any) {
                console.error("Erro ao buscar as turmas do professor:", error.message);
                alert(`Erro ao carregar suas turmas: ${error.message}`);
                setTurmasDoProfessor([]); // Limpa as turmas em caso de erro
            } finally {
                setLoadingTurmas(false);
            }
        };

        fetchTurmasDoProfessor();
    }, [user]); // Re-executa se o usuário mudar (ex: após login)

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
                        <p className="text-2xl font-bold text-blue-600">{turmasDoProfessor.length}</p> {/* Usa o número real */}
                        <p className="text-gray-600 text-sm">Turmas ativas</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-green-600" size={24} />
                            <h3 className="text-lg font-semibold text-gray-800">Alunos</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {/* Calcular o total de alunos nas turmas do professor */}
                            {turmasDoProfessor.reduce((total, turma) => total + turma.alunos, 0)}
                        </p>
                        <p className="text-gray-600 text-sm">Total de alunos</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="text-purple-600" size={24} />
                            <h3 className="text-lg font-semibold text-gray-800">Aulas Hoje</h3>
                        </div>
                        {/* Esta lógica precisaria de mais dados (data da aula) */}
                        <p className="text-2xl font-bold text-purple-600">N/A</p> {/* Ajuste conforme sua API */}
                        <p className="text-gray-600 text-sm">Aulas programadas</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Minhas Turmas</h2>
                    {loadingTurmas ? (
                        <p className="text-gray-600 text-center">Carregando turmas...</p>
                    ) : turmasDoProfessor.length === 0 ? (
                        <p className="text-gray-600 text-center">Nenhuma turma encontrada para você.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nome da Turma
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Disciplina
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Alunos
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Semestre
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Horário
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sala
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {turmasDoProfessor.map((turma) => (
                                        <tr key={turma.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{turma.nome}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turma.disciplina}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turma.alunos}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turma.semestre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} className="text-gray-500" /> {turma.horario}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-gray-500" /> {turma.sala}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Seções de Funcionalidades Existentes (Mantidas ou ajustadas) */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Outras Funcionalidades</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border-2 border-gray-200 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Gerenciar Turmas (Acesso Direto)</h3>
                            <p className="text-gray-600 text-sm mb-3">Acesse a gestão completa de turmas para edição ou criação.</p>
                            {/* Você pode usar um NavLink aqui se tiver uma rota /turmas */}
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Acessar
                            </button>
                        </div>
                        <div className="p-4 border-2 border-gray-200 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Notas e Frequência</h3>
                            <p className="text-gray-600 text-sm mb-3">Registre notas e frequência dos alunos.</p>
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