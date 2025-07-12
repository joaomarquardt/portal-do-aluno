import { useState, useEffect } from 'react';
import { GraduationCap, Edit, Trash2, Plus, User, Mail, BookOpen } from "lucide-react";

interface Professor {
    id: number;
    nome: string;
    cpf: string;
    emailPessoal: string;
    emailInstitucional: string;
    departamento: string;
    telefone: string;
    siape: string;
    disciplinas: string[];
}

const Professores = () => {
    const [cpfFormated, setCpfFormated] = useState('');
    const [professores, setProfessores] = useState<Professor[]>([
        {
            id: 1,
            nome: "Prof. João Silva",
            cpf: "16161305712",
            emailPessoal: "rafaeltavsilva@gmail.com",
            emailInstitucional: "joao.silva@faculdade.edu.br",
            departamento: "Matemática",
            telefone: "(11) 98765-4321",
            siape: "99999",
            disciplinas: ["Cálculo I", "Álgebra Linear"]
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

    const [formData, setFormData] = useState({
        nome: '',
        emailInstitucional: '',
        emailPessoal: '',
        siape: '',
        cpf: '',
        departamento: '',
        telefone: '',
        disciplinas: ''
    });

    // Novo estado para erros de validação
    const [errors, setErrors] = useState({
        nome: '',
        emailInstitucional: '',
        emailPessoal: '',
        siape: '',
        cpf: '',
        departamento: '',
        telefone: ''
    });

    // --- Funções de Validação ---

    const validateEmail = (email: string): string => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return "Campo obrigatório.";
        }
        if (!emailRegex.test(email)) {
            return "Formato de email inválido.";
        }
        return "";
    };

    const validateSiape = (siape: string): string => {
        if (!siape) {
            return "Campo obrigatório.";
        }
        if (!/^\d+$/.test(siape)) { // Apenas números
            return "SIAPE deve conter apenas números.";
        }
        if (siape.length < 5 || siape.length > 7) { // Exemplo: SIAPE tem geralmente 7 dígitos, mas aqui flexibilizei
            return "SIAPE inválido (5-7 dígitos).";
        }
        return "";
    };

    const validateCpf = (cpf: string): string => {
        if (!cpf) {
            return "Campo obrigatório.";
        }
        const cleanedCpf = cpf.replace(/\D/g, ''); // Remove todos os não-dígitos
        if (cleanedCpf.length !== 11 || /^(.)\1+$/.test(cleanedCpf)) {
            return "CPF inválido (deve conter 11 dígitos e não pode ser sequência de números iguais).";
        }

        // Validação de dígitos verificadores (aprimorada)
        let sum = 0;
        let rest;

        for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cleanedCpf.substring(9, 10))) return "CPF inválido.";

        sum = 0;
        for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cleanedCpf.substring(10, 11))) return "CPF inválido.";

        return ""; // CPF válido
    };

    const validateRequired = (value: string, fieldName: string): string => {
        if (!value.trim()) {
            return `O campo ${fieldName} é obrigatório.`;
        }
        return "";
    };

    const validatePhoneNumber = (phone: string): string => {
        // Permite números, espaços, hífens e parênteses
        const phoneRegex = /^[0-9\s\-()]*$/;
        if (phone && !phoneRegex.test(phone)) {
            return "Telefone contém caracteres inválidos.";
        }
        return "";
    };

    // --- Handle Submit ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const disciplinasArray = formData.disciplinas.split(',').map(d => d.trim()).filter(d => d);

        // Executar todas as validações
        const newErrors = {
            nome: validateRequired(formData.nome, "Nome Completo"),
            emailPessoal: validateEmail(formData.emailPessoal),
            emailInstitucional: validateEmail(formData.emailInstitucional),
            siape: validateSiape(formData.siape),
            cpf: validateCpf(formData.cpf),
            departamento: validateRequired(formData.departamento, "Departamento"),
            telefone: validatePhoneNumber(formData.telefone)
        };

        setErrors(newErrors);

        // Verificar se há algum erro
        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors) {
            alert("Por favor, corrija os erros no formulário antes de salvar.");
            return;
        }

        if (editingProfessor) {
            // Lógica de atualização (PUT)
            try {
                const res = await fetch(`http://localhost:3000/professores/${editingProfessor.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        nome: formData.nome,
                        emailInstitucional: formData.emailInstitucional,
                        emailPessoal: formData.emailPessoal,
                        siape: Number(formData.siape), // Converte para número se sua API espera assim
                        cpf: formData.cpf,
                        departamento: formData.departamento,
                        telefone: formData.telefone,
                        disciplinas: disciplinasArray // Envia como array
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(`Erro ao atualizar professor: ${res.status} - ${errorData.message || 'Erro desconhecido'}`);
                }

                const updatedProfessor = await res.json();
                setProfessores(prev => prev.map(prof =>
                    prof.id === editingProfessor.id
                        ? { ...prof, ...updatedProfessor, disciplinas: disciplinasArray } // Assume que a API pode não retornar disciplinas atualizadas
                        : prof
                ));
                alert("Professor atualizado com sucesso!");

            } catch (error: any) {
                console.error("Erro ao atualizar professor:", error.message);
                alert(`Erro ao atualizar professor: ${error.message}`);
            }

        } else {
            // Lógica de criação (POST)
            try {
                const res = await fetch("http://localhost:3000/professores", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        nome: formData.nome,
                        emailInstitucional: formData.emailInstitucional,
                        emailPessoal: formData.emailPessoal,
                        senha: formData.nome + formData.telefone.replace(/\D/g, ''), // Senha gerada
                        professor: { siape: Number(formData.siape), disciplinas: disciplinasArray }, // SIAPE e Disciplinas dentro de 'professor'
                        cpf: formData.cpf,
                        telefone: formData.telefone,
                        papeis: ['PROFESSOR']
                    })
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(`Erro ao cadastrar professor: ${res.status} - ${errorData.message || 'Erro desconhecido'}`);
                }

                const newProfessorData: Professor = await res.json(); // A API deve retornar o novo professor com ID
                setProfessores([...professores, newProfessorData]);
                alert("Professor cadastrado com sucesso!");

            } catch (error: any) {
                console.error("Erro ao cadastrar professor:", error.message);
                alert(`Erro ao cadastrar professor: ${error.message}`);
            }
        }

        resetForm();
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            emailInstitucional: '',
            emailPessoal: '',
            siape: '',
            cpf: '',
            departamento: '',
            telefone: '',
            disciplinas: ''
        });
        setCpfFormated(''); // Limpa o CPF formatado
        setErrors({ // Limpa todos os erros
            nome: '',
            emailInstitucional: '',
            emailPessoal: '',
            siape: '',
            cpf: '',
            departamento: '',
            telefone: ''
        });
        setShowForm(false);
        setEditingProfessor(null);
    };

    const handleEdit = (professor: Professor) => {
        setEditingProfessor(professor);
        setFormData({
            nome: professor.nome,
            emailInstitucional: professor.emailInstitucional,
            emailPessoal: professor.emailPessoal,
            siape: professor.siape,
            cpf: professor.cpf,
            departamento: professor.departamento,
            telefone: professor.telefone,
            disciplinas: professor.disciplinas.join(', ')
        });
        setCpfFormated(professor.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')); // Formata o CPF para exibição
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este professor?')) {
            try {
                const response = await fetch(`http://localhost:3000/professores/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro ao excluir professor: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
                }

                setProfessores(professores.filter(prof => prof.id !== id));
                alert('Professor excluído com sucesso!');

            } catch (error: any) {
                console.error("Erro ao excluir o professor:", error.message);
                alert(`Erro ao excluir o professor: ${error.message}`);
            }
        }
    };

    // Carrega professores ao montar o componente
    useEffect(() => {
        const fetchProfessores = async () => {
            try {
                const response = await fetch("http://localhost:3000/professores", {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Erro ao buscar professores: ${response.status}`);
                }
                const data = await response.json();
                setProfessores(data);
            } catch (error: any) {
                console.error("Erro ao buscar os professores:", error.message);
                // alert(`Erro ao carregar professores: ${error.message}`); // Desativado para não incomodar em dev
            }
        };

        fetchProfessores();
    }, []);


    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <GraduationCap className="text-green-600 mr-3" size={32} />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Gestão de Professores</h1>
                            <p className="text-sm text-gray-600">Gerencie os professores da instituição</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(true); // Apenas mostra o formulário
                            resetForm(); // Reseta o formulário e os erros para um novo professor
                        }}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Adicionar Professor
                    </button>
                </div>
            </div>

            {/* Formulário */}
            {showForm && (
                <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-6 shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {editingProfessor ? 'Editar Professor' : 'Adicionar Novo Professor'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                            <input
                                type="text"
                                value={formData.nome}
                                onChange={(e) => {
                                    setFormData({ ...formData, nome: e.target.value });
                                    setErrors(prev => ({ ...prev, nome: validateRequired(e.target.value, "Nome Completo") }));
                                }}
                                className={`w-full px-3 py-2 border-2 ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded focus:border-green-500`}
                                required
                            />
                            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal *</label>
                            <input
                                type="email"
                                value={formData.emailPessoal}
                                onChange={(e) => {
                                    setFormData({ ...formData, emailPessoal: e.target.value });
                                    setErrors(prev => ({ ...prev, emailPessoal: validateEmail(e.target.value) }));
                                }}
                                className={`w-full px-3 py-2 border-2 ${errors.emailPessoal ? 'border-red-500' : 'border-gray-300'} rounded focus:border-green-500`}
                                required
                            />
                            {errors.emailPessoal && <p className="text-red-500 text-sm mt-1">{errors.emailPessoal}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional *</label>
                            <input
                                type="email"
                                value={formData.emailInstitucional}
                                onChange={(e) => {
                                    setFormData({ ...formData, emailInstitucional: e.target.value });
                                    setErrors(prev => ({ ...prev, emailInstitucional: validateEmail(e.target.value) }));
                                }}
                                className={`w-full px-3 py-2 border-2 ${errors.emailInstitucional ? 'border-red-500' : 'border-gray-300'} rounded focus:border-green-500`}
                                required
                            />
                            {errors.emailInstitucional && <p className="text-red-500 text-sm mt-1">{errors.emailInstitucional}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                            <input
                                type="text"
                                value={formData.departamento}
                                onChange={(e) => {
                                    setFormData({ ...formData, departamento: e.target.value });
                                    setErrors(prev => ({ ...prev, departamento: validateRequired(e.target.value, "Departamento") }));
                                }}
                                className={`w-full px-3 py-2 border-2 ${errors.departamento ? 'border-red-500' : 'border-gray-300'} rounded focus:border-green-500`}
                                required
                            />
                            {errors.departamento && <p className="text-red-500 text-sm mt-1">{errors.departamento}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SIAPE *</label>
                            <input
                                type="text"
                                value={formData.siape}
                                onChange={(e) => {
                                    setFormData({ ...formData, siape: e.target.value });
                                    setErrors(prev => ({ ...prev, siape: validateSiape(e.target.value) }));
                                }}
                                className={`w-full px-3 py-2 border-2 ${errors.siape ? 'border-red-500' : 'border-gray-300'} rounded focus:border-green-500`}
                                required
                            />
                            {errors.siape && <p className="text-red-500 text-sm mt-1">{errors.siape}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                            <input
                                type="text"
                                value={formData.telefone}
                                onChange={(e) => {
                                    setFormData({ ...formData, telefone: e.target.value });
                                    setErrors(prev => ({ ...prev, telefone: validatePhoneNumber(e.target.value) }));
                                }}
                                className={`w-full px-3 py-2 border-2 ${errors.telefone ? 'border-red-500' : 'border-gray-300'} rounded focus:border-green-500`}
                            />
                            {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                            <input
                                type="text"
                                value={cpfFormated}
                                onChange={(e) => {
                                    const numbers = e.target.value.replace(/\D/g, ''); // Remove não-dígitos para a validação
                                    if (numbers.length <= 11) {
                                        const formatted = numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                                        setCpfFormated(formatted);
                                        setFormData({ ...formData, cpf: numbers }); // Armazena o CPF limpo no formData
                                        setErrors(prev => ({ ...prev, cpf: validateCpf(numbers) })); // Valida o CPF limpo
                                    }
                                }}
                                className={`w-full px-3 py-2 border-2 ${errors.cpf ? 'border-red-500' : 'border-gray-300'} rounded focus:border-green-500`}
                                placeholder="Ex: 000.000.000-00"
                                required
                            />
                            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Disciplinas (separadas por vírgula)</label>
                            <input
                                type="text"
                                value={formData.disciplinas}
                                onChange={(e) => setFormData({ ...formData, disciplinas: e.target.value })}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500"
                                placeholder="Ex: Matemática, Física, Química"
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                {editingProfessor ? 'Atualizar' : 'Adicionar'}
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

            {/* Lista de Professores */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Lista de Professores ({professores.length})
                </h2>

                {professores.length === 0 ? (
                    <div className="text-center py-8">
                        <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">Nenhum professor cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {professores.map((professor) => (
                            <div key={professor.id} className="bg-white border-2 border-green-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center">
                                        <User className="text-green-500 mr-2" size={20} />
                                        <h3 className="text-lg font-bold text-gray-800">{professor.nome}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(professor)}
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(professor.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center">
                                        <Mail className="text-gray-500 mr-2" size={16} />
                                        <span className="text-gray-600">Ins: {professor.emailInstitucional}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="text-gray-500 mr-2" size={16} />
                                        <span className="text-gray-600">Pessoal: {professor.emailPessoal}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                            {professor.departamento}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-gray-600 text-xs">Tel: {professor.telefone}</span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="flex items-center mb-1">
                                            <BookOpen className="text-gray-500 mr-1" size={14} />
                                            <span className="text-xs text-gray-600">Disciplinas:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {professor.disciplinas.map((disciplina, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                    {disciplina}
                                                </span>
                                            ))}
                                        </div>
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

export default Professores;