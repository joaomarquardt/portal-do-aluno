import { useEffect, useState } from 'react';
import { BookOpen, Clock, Plus, Edit, Trash2 } from "lucide-react"; // Removidos Users, Calendar se não usados
const apiUrl = import.meta.env.VITE_URL_API;

interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
  periodo: number; // Alterado para number, pois você converte para Number no handleSubmit
  cargaHoraria: number; // Alterado para number
}

// Interface para os erros de validação do formulário
interface DisciplinaFormErrors {
  nome?: string;
  codigo?: string;
  periodo?: string;
  cargaHoraria?: string;
  submit?: string; // Para erros gerais de submissão/API
}

const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]); // Renomeado para 'disciplinas'
  const [showForm, setShowForm] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    periodo: '', // Mantido como string no formData para input text
    cargaHoraria: '', // Mantido como string no formData para input text
  });
  const [errors, setErrors] = useState<DisciplinaFormErrors>({}); // Estado para os erros de validação

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await fetch(`${apiUrl}/disciplinas`, {
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data: Disciplina[] = await response.json();
        setDisciplinas(data);
      } catch (error) {
        console.error("Erro ao buscar as Disciplinas:", error);
        // Opcional: Adicionar um alerta ou mensagem para o usuário
      }
    };

    fetchDisciplinas();
  }, []);

  // Função de validação dos campos do formulário
  const validateForm = () => {
    let newErrors: DisciplinaFormErrors = {};
    let isValid = true;

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome da disciplina é obrigatório.';
      isValid = false;
    }
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'O código da disciplina é obrigatório.';
      isValid = false;
    }
    // Validação para carga horária
    const cargaHorariaNum = Number(formData.cargaHoraria);
    if (isNaN(cargaHorariaNum) || cargaHorariaNum <= 0) {
      newErrors.cargaHoraria = 'A carga horária deve ser um número positivo.';
      isValid = false;
    }

    // Validação para período
    const periodoNum = Number(formData.periodo);
    if (isNaN(periodoNum) || periodoNum <= 0) {
      newErrors.periodo = 'O período deve ser um número inteiro positivo.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpa o erro do campo assim que o usuário começa a digitar
    if (errors[name as keyof DisciplinaFormErrors]) {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name as keyof DisciplinaFormErrors];
        return updatedErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Impede o envio se a validação falhar
    }

    const payload = {
      codigo: formData.codigo,
      nome: formData.nome,
      periodo: Number(formData.periodo),
      cargaHoraria: Number(formData.cargaHoraria)
    };

    try {
      let response;
      if (editingDisciplina) {
        // Lógica de EDIÇÃO (PUT)
        response = await fetch(`${apiUrl}/disciplinas/${editingDisciplina.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Lógica de ADIÇÃO (POST)
        response = await fetch(`${apiUrl}/disciplinas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro: ${response.status}`);
      }

      const disciplinaSalva: Disciplina = await response.json();
      if (editingDisciplina) {
        setDisciplinas(prev => prev.map(d => d.id === disciplinaSalva.id ? disciplinaSalva : d));
        alert("Disciplina atualizada com sucesso!");
      } else {
        setDisciplinas(prev => [...prev, disciplinaSalva]);
        alert("Disciplina cadastrada com sucesso!");
      }
    } catch (error: any) {
      console.error("Erro ao processar disciplina:", error);
      setErrors(prev => ({ ...prev, submit: error.message || "Erro ao salvar disciplina. Tente novamente." }));
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', periodo: '', cargaHoraria: '' });
    setShowForm(false);
    setEditingDisciplina(null);
    setErrors({}); // Limpa os erros ao resetar o formulário
  };

  const handleEdit = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      periodo: disciplina.periodo.toString(), // Converte para string para o input
      cargaHoraria: disciplina.cargaHoraria.toString(), // Converte para string para o input
    });
    setShowForm(true);
    setErrors({}); // Limpa erros ao iniciar a edição
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta Disciplina?')) {
      try {
        const response = await fetch(`${apiUrl}/disciplinas/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao excluir disciplina: ${response.status}`);
        }

        setDisciplinas(prev => prev.filter(disciplina => disciplina.id !== id));
        alert("Disciplina excluída com sucesso!");
      } catch (error: any) {
        console.error("Erro ao excluir disciplina:", error);
        alert(error.message || "Erro ao excluir disciplina. Tente novamente.");
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
              <h1 className="text-2xl font-bold text-gray-800">Gestão de Disciplinas</h1>
              <p className="text-sm text-gray-600">Gerencie as Disciplinas e seus códigos</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingDisciplina(null); setErrors({}); }}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Disciplina
          </button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingDisciplina ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Disciplina *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                placeholder='Cálculo I'
                required
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.codigo ? 'border-red-500' : 'border-gray-300'}`}
                placeholder='ABC123'
                required
              />
              {errors.codigo && <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carga horária total (horas) *</label>
              <input
                type="number" // Alterado para type="number" para melhor validação e UX
                name="cargaHoraria"
                value={formData.cargaHoraria}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.cargaHoraria ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="60"
                min="1" // Adicionado min para números positivos
                required
              />
              {errors.cargaHoraria && <p className="text-red-500 text-xs mt-1">{errors.cargaHoraria}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período mínimo disponível *</label>
              <input
                type="number" // Alterado para type="number"
                name="periodo"
                value={formData.periodo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.periodo ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="1"
                min="1" // Adicionado min para números positivos
                required
              />
              {errors.periodo && <p className="text-red-500 text-xs mt-1">{errors.periodo}</p>}
            </div>

            {errors.submit && <p className="md:col-span-2 text-red-500 text-sm mt-2">{errors.submit}</p>}

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                {editingDisciplina ? 'Atualizar' : 'Adicionar'}
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

      {/* Lista de Disciplinas */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Lista de Disciplinas ({disciplinas.length})
        </h2>

        {disciplinas.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhuma Disciplina cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplinas.map((disciplina) => (
              <div key={disciplina.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <BookOpen className="text-purple-500 mr-2" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">{disciplina.nome}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(disciplina)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(disciplina.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      CÓDIGO: {disciplina.codigo}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600"> HORAS MÍNIMAS: {disciplina.cargaHoraria} hrs</span>
                  </div>

                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Período mínimo de inscrição: {disciplina.periodo}º
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

export default Disciplinas;