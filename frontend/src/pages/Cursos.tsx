
    import { useEffect, useState } from 'react';
    import { BookOpen, Users, Calendar, Edit, Trash2, Plus, Clock } from "lucide-react";
    const apiUrl = import.meta.env.VITE_URL_API;
    interface Curso {
    id: number;
    nome: string;
    tipo: string;
    anosDuracao: number;
    turno: string;
    departamento: string;

    }
    interface Professor {
    siape: string;
    departamento: string | null;
    Cursos: any[];
    }
    const Cursos = () => {
    const [Cursos, setCursos] = useState<Curso[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [editingCurso, setEditingCurso] = useState<Curso | null>(null);

    const [formData, setFormData] = useState({
        nome: '',
        tipo: '',

        anosDuracao: 0,
        turno: '',
        departamento: '',

    });
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
        console.error("Erro ao buscar os Cursos:", error);
        }
    };

    fetchCursos();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCurso) {
        setCursos(Cursos.map(c =>
        c.id === editingCurso.id ? { ...c, ...formData } : c
        ));
    } else {
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

  const resetForm = () => {
    setFormData({ nome: '', tipo: '', anosDuracao: 0, turno: '', departamento: '' });
    setShowForm(false);
    setEditingCurso(null);
  };

  const handleEdit = (Curso: Curso) => {
    setEditingCurso(Curso);
    setFormData({
      nome: Curso.nome,
      tipo: Curso.tipo,
      anosDuracao: Curso.anosDuracao,
      turno: Curso.turno,
      departamento: Curso.departamento,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta Curso?')) {
      setCursos(Cursos.filter(Curso => Curso.id !== id));
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
              <p className="text-sm text-gray-600">Gerencie as Cursos e tipos</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
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
            {editingCurso ? 'Editar Curso' : 'Adicionar Nova Curso'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Curso</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder='Sistemas de informação...'
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <input
                type="text"
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder=' Presencial, a distância...'
                required
              />
            </div>
            <div>
                        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input
                type="text"
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder="Informática aplicada, Biologia..."
                required
              />
            </div>
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (em anos) *</label>
              <input
                type="number"
                value={formData.anosDuracao}
                onChange={(e) => setFormData({...formData, anosDuracao: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
              <input
                type="text"
                value={formData.turno}
                onChange={(e) => setFormData({...formData, turno: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder="Noturno/diurno..."
                required
              />
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
          Lista de Cursos ({Cursos.length})
        </h2>

        {Cursos.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhuma Curso cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Cursos.map((Curso) => (
              <div key={Curso.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <BookOpen className="text-purple-500 mr-2" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">{Curso.nome}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(Curso)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(Curso.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      {Curso.tipo}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">{Curso.departamento} </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">{Curso.anosDuracao} anos ou {Number(Curso.anosDuracao) * 2} Periodos</span>
                  </div>


                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Turno: {Curso.turno}
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
