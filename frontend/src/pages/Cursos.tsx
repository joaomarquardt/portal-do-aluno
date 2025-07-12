import { useEffect, useState } from 'react';
import { BookOpen, Users, Edit, Trash2, Plus, Clock } from "lucide-react"; // Removi Calendar, não está sendo usado.

// Interfaces para tipagem
interface Curso {
    id: number;
    nome: string;
    tipo: string;
    anosDuracao: number;
    turno: string;
    departamento: string; // Confirmado que 'departamento' está sendo usado para 'horário'
}

// Interface Professor não está sendo usada neste componente, mantida por referência.
interface Professor {
    siape: string;
    departamento: string | null;
    Cursos: any[];
}

const Cursos = () => {
    // Estado para armazenar a lista de cursos
    const [cursos, setCursos] = useState<Curso[]>([]); // Renomeado para 'cursos' minúsculo para consistência

    // Estados para controle do formulário
    const [showForm, setShowForm] = useState(false);
    const [editingCurso, setEditingCurso] = useState<Curso | null>(null);

    // Estado para os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        tipo: '',
        anosDuracao: 0,
        turno: '',
        departamento: '', // Campo usado para o 'Horário'
    });

    // **NOVO ESTADO para armazenar mensagens de erro de validação**
    const [errors, setErrors] = useState({
        nome: '',
        tipo: '',
        anosDuracao: '',
        turno: '',
        departamento: '',
    });

    // Efeito para carregar os cursos quando o componente monta
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await fetch("http://localhost:3000/Cursos", {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const data: Curso[] = await response.json();
                setCursos(data);
            } catch (error) {
                console.error("Erro ao buscar os Cursos:", error);
                alert("Erro ao carregar cursos. Verifique o console para mais detalhes.");
            }
        };

        fetchCursos();
    }, []); // Array de dependências vazio para rodar apenas uma vez ao montar


    // **NOVA FUNÇÃO: Lógica de Validação do Formulário**
    const validateForm = () => {
        let newErrors = { // Objeto temporário para coletar os erros
            nome: '',
            tipo: '',
            anosDuracao: '',
            turno: '',
            departamento: '', // Para o campo 'Horário'
        };
        let isValid = true; // Flag para indicar se o formulário é válido

        // Validação do Nome do Curso
        if (!formData.nome.trim()) {
            newErrors.nome = 'O nome do curso é obrigatório.';
            isValid = false;
        } else if (formData.nome.trim().length < 3) {
            newErrors.nome = 'O nome do curso deve ter pelo menos 3 caracteres.';
            isValid = false;
        }

        // Validação do Tipo
        if (!formData.tipo.trim()) {
            newErrors.tipo = 'O tipo é obrigatório.';
            isValid = false;
        }

        // Validação da Duração em Anos
        if (formData.anosDuracao <= 0) {
            newErrors.anosDuracao = 'A duração em anos deve ser um número positivo.';
            isValid = false;
        } else if (formData.anosDuracao > 10) { // Exemplo: limite máximo de 10 anos
            newErrors.anosDuracao = 'A duração máxima é de 10 anos.';
            isValid = false;
        }

        // Validação do Turno
        if (!formData.turno.trim()) {
            newErrors.turno = 'O turno é obrigatório.';
            isValid = false;
        }
        // Exemplo de validação de formato para o turno (e.g., AAAA.N)
        else if (!/^\d{4}\.\d$/.test(formData.turno.trim())) {
            newErrors.turno = 'Formato do turno inválido (Ex: 2024.1).';
            isValid = false;
        }


        // Validação do Departamento (usado como Horário)
        if (!formData.departamento.trim()) {
            newErrors.departamento = 'O horário é obrigatório.';
            isValid = false;
        } else if (!/^\d{2}:\d{2} - \d{2}:\d{2}$/.test(formData.departamento.trim())) {
            newErrors.departamento = 'Formato de horário inválido (esperado HH:MM - HH:MM).';
            isValid = false;
        }


        setErrors(newErrors); // Atualiza o estado de erros com os novos erros encontrados
        return isValid; // Retorna o resultado da validação
    };

    // Handler para submissão do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Por favor, corrija os erros no formulário antes de continuar.');
            return;
        }

        if (editingCurso) {
            // Lógica REAL de atualização (PUT)
            try {
                const response = await fetch(`http://localhost:3000/Cursos/${editingCurso.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) {
                    throw new Error(`Erro ao atualizar curso: ${response.status}`);
                }
                const cursoAtualizado: Curso = await response.json();
                setCursos(cursos.map(c => c.id === editingCurso.id ? cursoAtualizado : c));
                alert("Curso atualizado com sucesso!");
            } catch (error) {
                console.error("Erro ao atualizar curso:", error);
                alert("Erro ao atualizar curso. Tente novamente.");
            }
        } else {
            // Lógica de adição (POST) - Esta parte permanece como já estava
            try {
                const response = await fetch("http://localhost:3000/Cursos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error(`Erro ao adicionar curso: ${response.status}`);
                }

                const cursoSalvo: Curso = await response.json();
                setCursos(prev => [...prev, cursoSalvo]);
                alert("Curso cadastrado com sucesso!");
            } catch (error) {
                console.error("Erro ao cadastrar curso:", error);
                alert("Erro ao cadastrar curso. Tente novamente.");
            }
        }

        resetForm();
    };

    // Função para resetar o formulário e estados
    const resetForm = () => {
        setFormData({ nome: '', tipo: '', anosDuracao: 0, turno: '', departamento: '' });
        setShowForm(false);
        setEditingCurso(null);
        setErrors({ nome: '', tipo: '', anosDuracao: '', turno: '', departamento: '' }); // **NOVO: Limpa os erros**
    };

    // Handler para editar um curso
    const handleEdit = (curso: Curso) => { // Renomeado o parâmetro para 'curso' (minúsculo)
        setEditingCurso(curso);
        setFormData({
            nome: curso.nome,
            tipo: curso.tipo,
            anosDuracao: curso.anosDuracao,
            turno: curso.turno,
            departamento: curso.departamento,
        });
        setShowForm(true);
        setErrors({ nome: '', tipo: '', anosDuracao: '', turno: '', departamento: '' }); // **NOVO: Limpa os erros ao editar**
    };

    // Handler para deletar um curso
    const handleDelete = async (id: number) => { // A função precisa ser 'async' para usar await
        if (window.confirm('Tem certeza que deseja excluir este Curso?')) {
            try {
                // Lógica REAL de exclusão (DELETE)
                const response = await fetch(`http://localhost:3000/Cursos/${id}`, {
                    method: "DELETE", // O método HTTP correto para exclusão
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}` // O token de autenticação
                    }
                });
                if (!response.ok) {
                    // Se a resposta não for bem-sucedida (status 4xx ou 5xx)
                    throw new Error(`Erro ao excluir curso: ${response.status}`);
                }
                // Se a exclusão na API foi bem-sucedida, remove o item do estado local
                setCursos(cursos.filter(curso => curso.id !== id));
                alert("Curso excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir curso:", error);
                alert("Erro ao excluir curso. Tente novamente.");
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <BookOpen className="text-purple-600 mr-3" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Gestão de Cursos</h1>
                            <p className="text-sm text-gray-600">Gerencie os cursos e seus tipos</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            resetForm(); // Garante que o formulário esteja limpo e sem erros ao abrir
                            setShowForm(true);
                        }}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Adicionar Curso
                    </button>
                </div>
            </div>

            {/* Formulário de Adição/Edição */}
            {showForm && (
                <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-6 shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {editingCurso ? 'Editar Curso' : 'Adicionar Novo Curso'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso</label>
                            <input
                                type="text"
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                // Adiciona borda vermelha se houver erro no campo 'nome'
                                className={`w-full px-3 py-2 border-2 ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded focus:border-purple-500`}
                            />
                            {/* Exibe a mensagem de erro se existir */}
                            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                        </div>

                        <div>
                            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <input
                                type="text"
                                id="tipo"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                className={`w-full px-3 py-2 border-2 ${errors.tipo ? 'border-red-500' : 'border-gray-300'} rounded focus:border-purple-500`}
                            />
                            {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
                        </div>

                        <div>
                            <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                            <input
                                type="text"
                                id="horario"
                                value={formData.departamento} // Confirmado: este campo é para o horário
                                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                className={`w-full px-3 py-2 border-2 ${errors.departamento ? 'border-red-500' : 'border-gray-300'} rounded focus:border-purple-500`}
                                placeholder="Ex: 08:00 - 10:00"
                            />
                            {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>}
                        </div>

                        <div>
                            <label htmlFor="anosDuracao" className="block text-sm font-medium text-gray-700 mb-1">Duração (em anos) *</label>
                            <input
                                type="number"
                                id="anosDuracao"
                                value={formData.anosDuracao}
                                onChange={(e) => setFormData({ ...formData, anosDuracao: parseInt(e.target.value) || 0 })}
                                className={`w-full px-3 py-2 border-2 ${errors.anosDuracao ? 'border-red-500' : 'border-gray-300'} rounded focus:border-purple-500`}
                                min="0" // Validação HTML5 para números não negativos
                            />
                            {errors.anosDuracao && <p className="text-red-500 text-xs mt-1">{errors.anosDuracao}</p>}
                        </div>

                        <div>
                            <label htmlFor="turno" className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                            <input
                                type="text"
                                id="turno"
                                value={formData.turno}
                                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                                className={`w-full px-3 py-2 border-2 ${errors.turno ? 'border-red-500' : 'border-gray-300'} rounded focus:border-purple-500`}
                                placeholder="Ex: 2024.1"
                            />
                            {errors.turno && <p className="text-red-500 text-xs mt-1">{errors.turno}</p>}
                        </div>

                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                            >
                                {editingCurso ? 'Atualizar' : 'Adicionar'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Cursos */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Lista de Cursos ({cursos.length}) {/* Usando 'cursos' minúsculo */}
                </h2>

                {cursos.length === 0 ? ( // Usando 'cursos' minúsculo
                    <div className="text-center py-8">
                        <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">Nenhum Curso cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {cursos.map((curso) => ( // Usando 'cursos' minúsculo e 'curso' para o item
                            <div key={curso.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <BookOpen className="text-purple-500 mr-2" size={20} />
                                        <h3 className="text-lg font-bold text-gray-800">{curso.nome}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(curso)}
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(curso.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="mt-2">
                                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                            {curso.tipo}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="text-gray-500 mr-2" size={16} />
                                        <span className="text-gray-600">Duração {curso.anosDuracao} anos</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="text-gray-500 mr-2" size={16} />
                                        <span className="text-gray-600">{curso.departamento}</span>
                                    </div>

                                    <div className="mt-2">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                            {curso.turno}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cursos;