import { useEffect, useState } from 'react';
import { BookOpen, Users, Clock, Edit, Trash2, Plus } from "lucide-react";

const apiUrl = import.meta.env.VITE_URL_API;

interface Curso {
  id: number;
  nome: string;
  tipo: string;
  anosDuracao: number;
  turno: string;
  departamento: string;
}

const Cursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]); // Renomeado para 'cursos' (minúsculo) para convenção
  const [showForm, setShowForm] = useState(false);
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    anosDuracao: 0,
    turno: '',
    departamento: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Novo estado para erros

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch(`${apiUrl}/cursos`, {
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
        console.error("Erro ao buscar os cursos:", error);
        // Opcional: Adicionar um alerta ou mensagem para o usuário sobre o erro de carregamento
      }
    };

    fetchCursos();
  }, []);

  // Função de validação
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome do curso é obrigatório.';
      isValid = false;
    }
    if (!formData.tipo.trim()) {
      newErrors.tipo = 'O tipo do curso é obrigatório.';
      isValid = false;
    }
    if (!formData.departamento.trim()) {
      newErrors.departamento = 'O departamento é obrigatório.';
      isValid = false;
    }
    if (formData.anosDuracao <= 0) {
      newErrors.anosDuracao = 'A duração em anos deve ser um número positivo.';
      isValid = false;
    }
    if (!formData.turno.trim()) {
      newErrors.turno = 'O turno é obrigatório.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'anosDuracao' ? parseInt(value) || 0 : value,
    }));

    // Limpa o erro do campo assim que o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Se a validação falhar, para o envio do formulário
      return;
    }

    if (editingCurso) {
      // Lógica para UPDATE (PUT) de um curso existente
      try {
        const response = await fetch(`${apiUrl}/cursos/${editingCurso.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao atualizar curso: ${response.status}`);
        }

        const cursoAtualizado: Curso = await response.json();
        setCursos(cursos.map(c =>
          c.id === editingCurso.id ? cursoAtualizado : c
        ));
        alert("Curso atualizado com sucesso!");
      } catch (error: any) {
        console.error("Erro ao atualizar curso:", error);
        setErrors(prev => ({ ...prev, submit: error.message || "Erro ao atualizar curso. Tente novamente." }));
      }
    } else {
      // Lógica para CREATE (POST) de um novo curso
      try {
        const response = await fetch(`${apiUrl}/cursos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao adicionar curso: ${response.status}`);
        }

        const cursoSalvo: Curso = await response.json();
        setCursos(prev => [...prev, cursoSalvo]);
        alert("Curso cadastrado com sucesso!");
      } catch (error: any) {
        console.error("Erro ao cadastrar curso:", error);
        setErrors(prev => ({ ...prev, submit: error.message || "Erro ao cadastrar curso. Tente novamente." }));
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', tipo: '', anosDuracao: 0, turno: '', departamento: '' });
    setShowForm(false);
    setEditingCurso(null);
    setErrors({}); // Limpa todos os erros ao resetar o formulário
  };

  const handleEdit = (curso: Curso) => { // Renomeado para 'curso'
    setEditingCurso(curso);
    setFormData({
      nome: curso.nome,
      tipo: curso.tipo,
      anosDuracao: curso.anosDuracao,
      turno: curso.turno,
      departamento: curso.departamento,
    });
    setShowForm(true);
    setErrors({}); // Limpa erros ao abrir para edição
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este Curso?')) {
      try {
        const response = await fetch(`${apiUrl}/cursos/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao excluir curso: ${response.status}`);
        }

        setCursos(cursos.filter(curso => curso.id !== id));
        alert("Curso excluído com sucesso!");
      } catch (error: any) {
        console.error("Erro ao excluir curso:", error);
        alert(error.message || "Erro ao excluir curso. Tente novamente.");
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
              <p className="text-sm text-gray-600">Gerencie os cursos e tipos</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingCurso(null); setErrors({}); }} // Garante que o formulário está limpo ao adicionar
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Curso
          </button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingCurso ? 'Editar Curso' : 'Adicionar Novo Curso'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso *</label>
              <input
                type="text"
                name="nome" // Adicionado name para handleChange genérico
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.nome ? 'border-red-500' : 'border-gray-300'}`}
                placeholder='Sistemas de informação...'
                required
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <input
                type="text"
                name="tipo" // Adicionado name
                value={formData.tipo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.tipo ? 'border-red-500' : 'border-gray-300'}`}
                placeholder='Presencial, a distância...'
                required
              />
              {errors.tipo && <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
              <input
                type="text"
                name="departamento" // Adicionado name
                value={formData.departamento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.departamento ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Informática aplicada, Biologia..."
                required
              />
              {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (em anos) *</label>
              <input
                type="number"
                name="anosDuracao" // Adicionado name
                value={formData.anosDuracao}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.anosDuracao ? 'border-red-500' : 'border-gray-300'}`}
                min="0"
                required // Adicionado required
              />
              {errors.anosDuracao && <p className="text-red-500 text-xs mt-1">{errors.anosDuracao}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turno *</label>
              <input
                type="text"
                name="turno" // Adicionado name
                value={formData.turno}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${errors.turno ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Noturno/diurno..."
                required
              />
              {errors.turno && <p className="text-red-500 text-xs mt-1">{errors.turno}</p>}
            </div>

            {errors.submit && <p className="md:col-span-2 text-red-500 text-sm mt-2">{errors.submit}</p>} {/* Erro de submit */}

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
          Lista de Cursos ({cursos.length})
        </h2>

        {cursos.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhum curso cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cursos.map((curso) => (
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
                    <span className="text-gray-600">{curso.departamento} </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">{curso.anosDuracao} anos ou {Number(curso.anosDuracao) * 2} Períodos</span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Turno: {curso.turno}
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