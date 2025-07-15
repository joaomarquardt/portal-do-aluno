
    import { useEffect, useState } from 'react';
    import { BookOpen, Users, Calendar, Edit, Trash2, Plus, Clock } from "lucide-react";
    const apiUrl = import.meta.env.VITE_URL_API;
    interface Disciplina {
    id:number;
    codigo: string;
    nome: string;
    periodo: string;
    cargaHoraria: string;

    }
    interface Professor {
    siape: string;
    cargaHoraria: string | null;
    Disciplinas: any[];
    }
    const Disciplinas = () => {
    const [Disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);

    const [formData, setFormData] = useState({
        nome: '',
        codigo: '',

        anosDuracao: 0,
        periodo: '',
        cargaHoraria: '',

    });
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
        console.error("Erro ao buscar os Disciplinas:", error);
        }
    };

    fetchDisciplinas();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
    const response = await fetch(`http://localhost:8080/disciplinas`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            codigo:formData.codigo,
            nome:formData.nome,
            periodo:Number(formData.periodo),
            cargaHoraria:Number(formData.cargaHoraria)
        }),
    });

        if (!response.ok) {
            throw new Error(`Erro ao adicionar Disciplina: ${response.status}`);
        }

        const DisciplinaSalvo: Disciplina = await response.json();
        setDisciplinas(prev => [...prev, DisciplinaSalvo]);
        alert("Disciplina cadastrado com sucesso!");
        } catch (error) {
        console.error("Erro ao cadastrar Disciplina:", error);
        alert("Erro ao cadastrar Disciplina. Tente novamente.");
        }


    resetForm();
    };

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', anosDuracao: 0, periodo: '', cargaHoraria: '' });
    setShowForm(false);
    setEditingDisciplina(null);
  };


  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="text-purple-600 mr-3" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestão de Disciplinas</h1>
              <p className="text-sm text-gray-600">Gerencie as Disciplinas e codigos</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Disciplina
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingDisciplina ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Disciplina</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder='Calculo'
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder='ABC123'
                required
              />
            </div>
            <div>
                        <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carga horária total</label>
              <input
                type="text"
                value={formData.cargaHoraria}
                onChange={(e) => setFormData({...formData, cargaHoraria: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder="60/120"
                required
              />
            </div>
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Periodo minimo na qual essa disicplina estará disponivel *</label>
              <input
                type="text"
                value={formData.periodo}
                onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"

                required
              />
            </div>


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

      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Lista de Disciplinas ({Disciplinas.length})
        </h2>

        {Disciplinas.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhuma Disciplina cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Disciplinas.map((Disciplina) => (
              <div key={Disciplina.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <BookOpen className="text-purple-500 mr-2" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">{Disciplina.nome}</h3>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      CÓDIGO: {Disciplina.codigo}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600"> HORAS MÍNIMAS: {Disciplina.cargaHoraria} hrs</span>
                  </div>


                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Periodo mínimo de inscrição: {Disciplina.periodo}
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
