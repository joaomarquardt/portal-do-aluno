import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";

interface Periodo {
    id: number;
    nome: string;
    dataInicio: string;
    dataFim: string;
    ativo: boolean;
}

const Periodos = () => {
    const [periodos, setPeriodos] = useState<Periodo[]>([
        // Exemplo de dados iniciais (remover em produção se os dados vêm da API)
        // { id: 1, nome: "2024.1", dataInicio: "2024-02-01", dataFim: "2024-06-30", ativo: true },
        // { id: 2, nome: "2024.2", dataInicio: "2024-08-01", dataFim: "2024-12-15", ativo: false },
    ]);

    const [editingPeriodo, setEditingPeriodo] = useState<Periodo | null>(null);
    const [year, setYear] = useState<number>(new Date().getFullYear()); // Inicializa com o ano atual
    const [period, setPeriod] = useState<number>(1);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        dataInicio: '',
        dataFim: '',
        ativo: false
    });

    const [errors, setErrors] = useState({
        nome: '',
        dataInicio: '',
        dataFim: ''
    });

    // Funções de validação
    const validateName = (name: string) => {
        const regex = /^(\d{4})\.(1|2)$/;
        const match = name.match(regex);
        const currentYear = new Date().getFullYear();

        if (match) {
            const inputYear = Number.parseInt(match[1]);
            if (inputYear < currentYear) {
                return "O ano do período não pode ser anterior ao ano atual.";
            }
            // Atualiza year e period apenas se o formato for válido
            setYear(inputYear);
            setPeriod(Number.parseInt(match[2]));
            return "";
        } else {
            return "Formato inválido. Use AAAA.S (ex: 2025.1)";
        }
    };

    const validateDates = (dataInicio: string, dataFim: string) => {
        let newErrors = { dataInicio: '', dataFim: '' };
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zera a hora para comparação de data

        const startDate = dataInicio ? new Date(dataInicio + 'T00:00:00') : null; // Garante que a data seja interpretada corretamente
        const endDate = dataFim ? new Date(dataFim + 'T00:00:00') : null;

        if (startDate && startDate < today) {
            newErrors.dataInicio = "A data de início não pode ser anterior à data atual.";
        }

        if (startDate && endDate && startDate >= endDate) {
            newErrors.dataFim = "A data de fim deve ser posterior à data de início.";
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Executar todas as validações antes de submeter
        const nameError = validateName(formData.nome);
        const dateErrors = validateDates(formData.dataInicio, formData.dataFim);

        // Atualizar o estado de erros
        setErrors({
            nome: nameError,
            dataInicio: dateErrors.dataInicio,
            dataFim: dateErrors.dataFim
        });

        // Se houver qualquer erro, impede o envio do formulário
        if (nameError || dateErrors.dataInicio || dateErrors.dataFim) {
            alert("Por favor, corrija os erros no formulário antes de salvar.");
            return;
        }

        try {
    if (editingPeriodo) {
        // ATUALIZAÇÃO VIA PUT PARA A API
        const response = await fetch(`http://localhost:3000/periodo-letivo/${editingPeriodo.id}`, {
            method: "PUT", // Método HTTP para atualização
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                ano: year,      // Usa o 'year' validado pelo nome do período
                semestre: period, // Usa o 'period' validado pelo nome do período
                ativo: formData.ativo,
                dataInicio: formData.dataInicio,
                dataFim: formData.dataFim
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao atualizar período: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        // Se a atualização na API for bem-sucedida, atualiza o estado local
        const updatedPeriodo: Periodo = await response.json(); // A API pode retornar o objeto atualizado
        setPeriodos(prev =>
            prev.map(p => (p.id === updatedPeriodo.id ? updatedPeriodo : p))
        );
        setEditingPeriodo(null); // Limpa o estado de edição
        alert('Período atualizado com sucesso!');

    } else {
        // Criar novo período via POST
        const response = await fetch("http://localhost:3000/periodo-letivo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                ano: year,
                semestre: period,
                ativo: formData.ativo,
                dataInicio: formData.dataInicio,
                dataFim: formData.dataFim
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro ao criar período: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
        }

        const savedPeriodo: Periodo = await response.json();
        setPeriodos(prev => [...prev, savedPeriodo]);

        alert('Período criado com sucesso!');
    }
} catch (error: any) {
    console.error("Erro no envio do período:", error.message);
    alert(`Erro ao salvar o período: ${error.message}`);
}

        // Resetar formulário e erros
        setFormData({ nome: '', dataInicio: '', dataFim: '', ativo: false });
        setShowForm(false);
        setEditingPeriodo(null);
        setErrors({ nome: '', dataInicio: '', dataFim: '' }); // Limpa os erros após a submissão
    };

    const handleEdit = (periodo: Periodo) => {
        setEditingPeriodo(periodo);
        setFormData({
            nome: periodo.nome,
            dataInicio: periodo.dataInicio,
            dataFim: periodo.dataFim,
            ativo: periodo.ativo
        });
        // Quando for editar, também valida o nome para preencher year e period
        validateName(periodo.nome);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => { // Adicionado 'async' aqui
    if (window.confirm('Tem certeza que deseja excluir este período?')) {
        try {
            const response = await fetch(`http://localhost:3000/periodo-letivo/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}` // Certifique-se de enviar o token
                },
            });

            if (!response.ok) {
                // Se a resposta não for OK (ex: 404, 500), joga um erro
                const errorData = await response.json(); // Tenta ler a mensagem de erro da API
                throw new Error(`Erro ao excluir período: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
            }

            // Se a exclusão na API for bem-sucedida, atualiza o estado local
            setPeriodos(periodos.filter(p => p.id !== id));
            alert('Período excluído com sucesso!');

        } catch (error: any) {
            console.error("Erro ao excluir o período:", error.message);
            alert(`Erro ao excluir o período: ${error.message}`);
        }
    }
};

    const cancelForm = () => {
        setShowForm(false);
        setEditingPeriodo(null);
        setFormData({ nome: '', dataInicio: '', dataFim: '', ativo: false });
        setErrors({ nome: '', dataInicio: '', dataFim: '' }); // Limpa os erros ao cancelar
    };

    useEffect(() => {
        const fetchPeriods = async () => {
            try {
                const response = await fetch("http://localhost:3000/periodo-letivo", {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Erro ao buscar períodos: ${response.status}`);
                }
                const data: Periodo[] = await response.json();
                setPeriodos(data);
            } catch (error: any) {
                console.error("Erro ao buscar os períodos:", error.message);
                alert(`Erro ao carregar períodos: ${error.message}`);
            }
        };

        fetchPeriods();
    }, []);

    return (
        <div className="p-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="text-blue-600" />
                        Gestão de Períodos Letivos
                    </h1>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            cancelForm(); // Limpa o formulário e erros ao abrir/fechar
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        {showForm ? 'Cancelar' : 'Novo Período'}
                    </button>
                </div>

                {/* Formulário */}
                {showForm && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {editingPeriodo ? 'Editar Período' : 'Novo Período'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome do Período *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nome}
                                        onChange={(e) => {
                                            setFormData({ ...formData, nome: e.target.value });
                                            setErrors(prev => ({ ...prev, nome: validateName(e.target.value) }));
                                        }}
                                        className={`w-full px-3 py-2 border-2 ${errors.nome ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500`}
                                        placeholder="Ex: 2025.1"
                                        required
                                    />
                                    {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data de Início *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dataInicio}
                                        onChange={(e) => {
                                            setFormData({ ...formData, dataInicio: e.target.value });
                                            const dateValidation = validateDates(e.target.value, formData.dataFim);
                                            setErrors(prev => ({ ...prev, dataInicio: dateValidation.dataInicio, dataFim: dateValidation.dataFim }));
                                        }}
                                        className={`w-full px-3 py-2 border-2 ${errors.dataInicio ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500`}
                                        required
                                    />
                                    {errors.dataInicio && <p className="text-red-500 text-sm mt-1">{errors.dataInicio}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Data de Fim *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dataFim}
                                        onChange={(e) => {
                                            setFormData({ ...formData, dataFim: e.target.value });
                                            const dateValidation = validateDates(formData.dataInicio, e.target.value);
                                            setErrors(prev => ({ ...prev, dataInicio: dateValidation.dataInicio, dataFim: dateValidation.dataFim }));
                                        }}
                                        className={`w-full px-3 py-2 border-2 ${errors.dataFim ? 'border-red-500' : 'border-gray-300'} rounded focus:border-blue-500`}
                                        required
                                    />
                                    {errors.dataFim && <p className="text-red-500 text-sm mt-1">{errors.dataFim}</p>}
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.ativo}
                                            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Período Ativo</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    {editingPeriodo ? 'Atualizar' : 'Salvar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelForm}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Lista de Períodos */}
                <div className="space-y-3">
                    {periodos.map((periodo) => (
                        <div key={periodo.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">{periodo.nome}</h3>
                                        {periodo.ativo && (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                                ATIVO
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-gray-600">
                                        <p><strong>Início:</strong> {new Date(periodo.dataInicio).toLocaleDateString('pt-BR')}</p>
                                        <p><strong>Fim:</strong> {new Date(periodo.dataFim).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(periodo)}
                                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                                        title="Editar"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(periodo.id)}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {periodos.length === 0 && (
                    <div className="text-center py-8">
                        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">Nenhum período letivo cadastrado ainda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Periodos;