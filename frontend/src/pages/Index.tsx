import { useEffect, useState } from 'react';
import { Users, MessageSquarePlus, X } from 'lucide-react';
import StudentCard from '../components/StudentCard';
import AddStudentForm from '../components/AddStudentForm'; // Este componente precisa ter suas próprias validações internas
import Stats from '../components/Stats';

interface Student {
    id: number;
    cpf: string;
    name: string;
    email: string;
    institucionalEmail: string;
    cellphone: string;
    CursoId: number;
}

interface Comunicado {
    id: number;
    titulo: string;
    mensagem: string;
}

interface ComunicadoServ {
    id: number;
    titulo: string;
    mensagem: string;
    data: string;
}

const Index = () => {
    const [students, setStudents] = useState<Student[]>([]);

    const [comunicados, setComunicados] = useState<Comunicado[]>([]) // Este estado parece não ser usado diretamente
    const [ComunicadosServ, setComunicadosServ] = useState<ComunicadoServ[]>([]);

    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showComunicadoForm, setShowComunicadoForm] = useState(false);
    const [comunicadoForm, setComunicadoForm] = useState({ titulo: '', mensagem: '' });

    // --- NOVO: Estado para erros do formulário de comunicado ---
    const [comunicadoErrors, setComunicadoErrors] = useState({
        titulo: '',
        mensagem: '',
    });

    useEffect(() => {
        const fetchComunicados = async () => {
            try {
                const response = await fetch('http://localhost:3000/comunicados', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar comunicados: ${response.status}`);
                }

                const data: ComunicadoServ[] = await response.json();
                setComunicadosServ(data);
            } catch (error) {
                console.error("Erro ao buscar comunicados:", error);
                alert("Erro ao carregar comunicados. Tente novamente.");
            }
        };

        fetchComunicados();
    }, []);

    const getNextId = (list: { id: number }[]) => Math.max(0, ...list.map(item => item.id)) + 1;

    const addStudent = (data: Omit<Student, 'id'>) => {
        const newStudent: Student = { ...data, id: getNextId(students) };
        setStudents(prev => [...prev, newStudent]);
        console.log('Estudante adicionado:', newStudent);
        // Em um cenário real, você faria uma requisição POST para o backend aqui.
    };

    const updateStudent = (updated: Student) => {
        setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
        setEditingStudent(null);
        console.log('Estudante atualizado:', updated);
        // Em um cenário real, você faria uma requisição PUT para o backend aqui.
    };

    const deleteStudent = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este estudante?')) {
            setStudents(prev => prev.filter(s => s.id !== id));
            console.log('Estudante excluído:', id);
            // Em um cenário real, você faria uma requisição DELETE para o backend aqui.
        }
    };

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- NOVO: Função de validação para o formulário de comunicado ---
    const validateComunicadoForm = () => {
        let newErrors = { titulo: '', mensagem: '' };
        let isValid = true;

        if (!comunicadoForm.titulo.trim()) {
            newErrors.titulo = 'O título do comunicado é obrigatório.';
            isValid = false;
        } else if (comunicadoForm.titulo.trim().length < 5) {
            newErrors.titulo = 'O título deve ter pelo menos 5 caracteres.';
            isValid = false;
        }

        if (!comunicadoForm.mensagem.trim()) {
            newErrors.mensagem = 'A mensagem do comunicado é obrigatória.';
            isValid = false;
        } else if (comunicadoForm.mensagem.trim().length < 10) {
            newErrors.mensagem = 'A mensagem deve ter pelo menos 10 caracteres.';
            isValid = false;
        }

        setComunicadoErrors(newErrors); // Atualiza o estado de erros
        return isValid;
    };

    const handleComunicadoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // **PASSO DE VALIDAÇÃO: Executa a validação antes de qualquer operação de API**
        if (!validateComunicadoForm()) {
            alert('Por favor, preencha o formulário de comunicado corretamente.');
            return; // Interrompe a submissão se a validação falhar
        }

        const novo: Omit<Comunicado, 'id'> = {
            titulo: comunicadoForm.titulo,
            mensagem: comunicadoForm.mensagem,
        };

        try {
            const response = await fetch('http://localhost:3000/comunicados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(novo),
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar comunicado: ${response.status}`);
            }

            const comunicadoSalvo: ComunicadoServ = await response.json();
            setComunicadosServ(prev => [comunicadoSalvo, ...prev]);

            // Resetar formulário e erros após sucesso
            setComunicadoForm({ titulo: '', mensagem: '' });
            setShowComunicadoForm(false);
            setComunicadoErrors({ titulo: '', mensagem: '' }); // Limpa os erros após sucesso
            alert('Comunicado criado com sucesso!');
        } catch (error) {
            console.error("Erro ao criar comunicado:", error);
            alert('Erro ao criar comunicado. Tente novamente.');
        }
    };

    const deleteComunicado = async (id: number) => { // Tornar async para a chamada real da API
        if (confirm('Tem certeza que deseja excluir este comunicado?')) {
            try {
                const response = await fetch(`http://localhost:3000/comunicados/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erro ao excluir comunicado: ${response.status}`);
                }

                setComunicadosServ(prev => prev.filter(c => c.id !== id));
                alert('Comunicado excluído com sucesso!');
            } catch (error) {
                console.error("Erro ao excluir comunicado:", error);
                alert('Erro ao excluir comunicado. Tente novamente.');
            }
        }
    };

    const filteredStudents = students.filter(({ name, email }) =>
        [name, email].some(field =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="p-6">
            <Stats students={students} />

            {/* Comunicados */}
            <section className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Comunicados</h2>
                    <button
                        onClick={() => {
                            setShowComunicadoForm(true);
                            setComunicadoErrors({ titulo: '', mensagem: '' }); // Limpa erros ao abrir o formulário
                            setComunicadoForm({ titulo: '', mensagem: '' }); // Limpa campos ao abrir
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                        <MessageSquarePlus size={16} />
                        Criar Comunicado
                    </button>
                </div>

                {showComunicadoForm && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-gray-800">Novo Comunicado</h3>
                            <button
                                onClick={() => {
                                    setShowComunicadoForm(false);
                                    setComunicadoErrors({ titulo: '', mensagem: '' }); // Limpa erros ao fechar
                                    setComunicadoForm({ titulo: '', mensagem: '' }); // Limpa campos ao fechar
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleComunicadoSubmit}>
                            <div className="mb-3">
                                <label htmlFor="comunicadoTitulo" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    id="comunicadoTitulo"
                                    value={comunicadoForm.titulo}
                                    onChange={(e) => setComunicadoForm({ ...comunicadoForm, titulo: e.target.value })}
                                    className={`w-full px-3 py-2 border-2 ${comunicadoErrors.titulo ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500`}
                                    // Removido 'required' do HTML5 para que nossa validação controle
                                />
                                {comunicadoErrors.titulo && <p className="text-red-500 text-xs mt-1">{comunicadoErrors.titulo}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="comunicadoMensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                                <textarea
                                    id="comunicadoMensagem"
                                    value={comunicadoForm.mensagem}
                                    onChange={(e) => setComunicadoForm({ ...comunicadoForm, mensagem: e.target.value })}
                                    className={`w-full px-3 py-2 border-2 ${comunicadoErrors.mensagem ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500 h-24`}
                                    // Removido 'required' do HTML5 para que nossa validação controle
                                />
                                {comunicadoErrors.mensagem && <p className="text-red-500 text-xs mt-1">{comunicadoErrors.mensagem}</p>}
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Enviar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowComunicadoForm(false);
                                        setComunicadoErrors({ titulo: '', mensagem: '' });
                                        setComunicadoForm({ titulo: '', mensagem: '' });
                                    }}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista de comunicados */}
                <div className="space-y-3">
                    {ComunicadosServ.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquarePlus className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600">Nenhum comunicado disponível.</p>
                        </div>
                    ) : (
                        ComunicadosServ.map(({ id, titulo, mensagem, data }) => (
                            <div key={id} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{titulo}</h4>
                                        <p className="text-gray-600 mt-1">{mensagem}</p>
                                        <p className="text-sm text-gray-500 mt-2">Administração - {new Date(data + 'Z').toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <button onClick={() => deleteComunicado(id)} className="text-red-500 hover:text-red-700 ml-2">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Este componente (AddStudentForm) DEVE ter suas validações internas */}
            <AddStudentForm
                onAddStudent={addStudent}
                editingStudent={editingStudent}
                onUpdateStudent={updateStudent}
                onCancel={() => setEditingStudent(null)}
            />

            {/* Busca */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
                <label htmlFor="searchStudent" className="block text-sm font-medium text-gray-700 mb-2">Buscar Estudantes</label>
                <input
                    type="text"
                    id="searchStudent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Busque por nome, email ou curso..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
                />
            </div>

            {/* Lista de Estudantes */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Lista de Estudantes ({filteredStudents.length})
                    </h2>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="text-center py-8">
                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">
                            {searchTerm ? 'Nenhum estudante encontrado.' : 'Nenhum estudante cadastrado ainda.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.map((student) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onEdit={handleEdit}
                                onDelete={deleteStudent}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Index;