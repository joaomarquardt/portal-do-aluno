import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";

interface Periodo {
    id: number;
    nome: string;
    dataInicio: string;
    dataFim: string;
    ativo: boolean;
}

// Interface para os erros de validação do formulário
interface PeriodoFormErrors {
  nome?: string;
  dataInicio?: string;
  dataFim?: string;
  submit?: string; // Para erros gerais de submissão/API
}

const apiUrl = import.meta.env.VITE_URL_API;

const Periodos = () => {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [editingPeriodo, setEditingPeriodo] = useState<Periodo | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    ativo: false
  });
  const [formErrors, setFormErrors] = useState<PeriodoFormErrors>({}); // NOVO: Estado para erros de validação

  // Função para validar o nome do período (AAAA.S) e extrair ano/semestre
  const parsePeriodoName = (name: string) => {
    const regex = /^(\d{4})\.(1|2)$/;
    const match = name.match(regex);
    if (match) {
      return { year: Number(match[1]), semester: Number(match[2]) };
    }
    return null;
  };

  // Função de validação do formulário
  const validateForm = () => {
    let newErrors: PeriodoFormErrors = {};
    let isValid = true;

    // Validação do Nome do Período
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome do período é obrigatório.';
      isValid = false;
    } else {
      const parsed = parsePeriodoName(formData.nome);
      if (!parsed) {
        newErrors.nome = 'Formato inválido. Use AAAA.S (ex: 2024.1).';
        isValid = false;
      }
    }

    // Validação da Data de Início
    if (!formData.dataInicio) {
      newErrors.dataInicio = 'A data de início é obrigatória.';
      isValid = false;
    }

    // Validação da Data de Fim
    if (!formData.dataFim) {
      newErrors.dataFim = 'A data de fim é obrigatória.';
      isValid = false;
    } else if (formData.dataInicio && new Date(formData.dataFim) <= new Date(formData.dataInicio)) {
      newErrors.dataFim = 'A data de fim deve ser posterior à data de início.';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Limpa o erro do campo assim que o usuário começa a digitar/interagir
    if (formErrors[name as keyof PeriodoFormErrors]) {
      setFormErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name as keyof PeriodoFormErrors];
        return updatedErrors;
      });
    }
    setFormErrors(prev => ({ ...prev, submit: undefined })); // Limpa erro de submit ao interagir
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({}); // Limpa erros anteriores ao tentar submeter

    if (!validateForm()) {
      return; // Impede o envio se a validação falhar
    }

    const parsedName = parsePeriodoName(formData.nome);
    if (!parsedName) { // Esta verificação já foi feita em validateForm, mas é um fallback
      setFormErrors(prev => ({ ...prev, nome: 'Formato inválido. Use AAAA.S (ex: 2024.1).' }));
      return;
    }

    const payload = {
      ano: parsedName.year,
      semestre: parsedName.semester,
      ativo: formData.ativo,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim
    };

    try {
      let response;
      if (editingPeriodo) {
        // Lógica de EDIÇÃO (PUT)
        response = await fetch(`${apiUrl}/periodos-letivos/${editingPeriodo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Lógica de CRIAÇÃO (POST)
        response = await fetch(`${apiUrl}/periodos-letivos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro: ${response.status}`);
      }

      const savedPeriodo: Periodo = await response.json();
      if (editingPeriodo) {
        setPeriodos(prev => prev.map(p => (p.id === savedPeriodo.id ? savedPeriodo : p)));
        alert('Período atualizado com sucesso!');
      } else {
        setPeriodos(prev => [...prev, savedPeriodo]);
        alert('Período criado com sucesso!');
      }
    } catch (error: any) {
      console.error("Erro no envio do período:", error);
      setFormErrors(prev => ({ ...prev, submit: error.message || "Erro ao salvar o período. Tente novamente." }));
    }

    resetForm();
  };

  const handleEdit = (periodo: Periodo) => {
    setEditingPeriodo(periodo);
    setFormData({
      nome: periodo.nome,
      dataInicio: periodo.dataInicio,
      dataFim: periodo.dataFim,
      ativo: periodo.ativo
    });
    setShowForm(true);
    setFormErrors({}); // Limpa erros ao abrir para edição
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este período?')) {
      try {
        const response = await fetch(`${apiUrl}/periodos-letivos/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao excluir período: ${response.status}`);
        }

        setPeriodos(prev => prev.filter(p => p.id !== id));
        alert('Período excluído com sucesso!');
      } catch (error: any) {
        console.error("Erro ao excluir período:", error);
        alert(error.message || "Erro ao excluir período. Tente novamente.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', dataInicio: '', dataFim: '', ativo: false });
    setShowForm(false);
    setEditingPeriodo(null);
    setFormErrors({}); // Limpa todos os erros ao resetar o formulário
  };

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch(`${apiUrl}/periodos-letivos`, {
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data: Periodo[] = await response.json();
        setPeriodos(data);
      } catch (error) {
        console.error("Erro ao buscar os períodos:", error);
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
            onClick={() => { setShowForm(!showForm); setEditingPeriodo(null); setFormErrors({}); }}
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
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded focus:border-blue-500 ${formErrors.nome ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: 2024.1"
                    required
                  />
                  {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    name="dataInicio"
                    value={formData.dataInicio}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded focus:border-blue-500 ${formErrors.dataInicio ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formErrors.dataInicio && <p className="text-red-500 text-xs mt-1">{formErrors.dataInicio}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim *
                  </label>
                  <input
                    type="date"
                    name="dataFim"
                    value={formData.dataFim}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 rounded focus:border-blue-500 ${formErrors.dataFim ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formErrors.dataFim && <p className="text-red-500 text-xs mt-1">{formErrors.dataFim}</p>}
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Período Ativo</span>
                  </label>
                </div>
              </div>

              {formErrors.submit && <p className="text-red-500 text-sm mb-3">{formErrors.submit}</p>}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingPeriodo ? 'Atualizar' : 'Salvar'}
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