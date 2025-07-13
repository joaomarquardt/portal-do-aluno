
import { useEffect, useState } from 'react';
import { BookOpen, Users, Calendar, Edit, Trash2, Plus, Clock } from "lucide-react";


interface Disciplina{
	id:number,
	codigo: string,
	nome: string,
	periodo: number,
	cargaHoraria:number;
}
interface Turma {
  id: number;
  horario: string;
  vagasTotais: number;
  disciplina: string;
  professor: string;
}

interface TurmaServ {
  id:number;
  codigo: string;
  horario: string;
  periodo: string;
  vagasTotais: number;
  professor: string;
  disciplina:Disciplina;
}
interface Professor {
  id:number;
  nome:string;
}
const apiUrl = import.meta.env.VITE_URL_API;
const Turmas = () => {
  const [turmas, setTurmas] = useState<TurmaServ[]>([

  ]);
  const [disciplinas,setDisciplinas] = useState<Disciplina[]>([])
  const [showForm, setShowForm] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [formData, setFormData] = useState({
    disciplina: '',
    professor: '',
    vagasTotais: 0,
    horario: '',
    
  });
useEffect(() => {
  const fetchProfessores = async () => {
    try {
      const response = await fetch(`${apiUrl}/professores/select`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data: Professor[] = await response.json();
      setProfessores(data); // ✅ armazena exatamente como a API envia
    } catch (error) {
      console.error("Erro ao buscar os professores:", error);
    }
  };

  fetchProfessores();
}, []);
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
      setDisciplinas(data); // ✅ armazena exatamente como a API envia
    } catch (error) {
      console.error("Erro ao buscar os Disciplinas:", error);
    }
  };

  fetchDisciplinas();
}, []);
useEffect(() => {
  const fetchTurmas = async () => {
    try {
      const response = await fetch(`${apiUrl}/turmas`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      const turmasTratadas = data.map((turma: any) => ({
        ...turma,
        professor: turma.professor?.nome || 'Desconhecido'
      }));
      setTurmas(turmasTratadas);
    } catch (error) {
      console.error("Erro ao buscar os professores:", error);
    }
  };

  fetchTurmas();
}, []);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Encontrar os IDs com base nos nomes selecionados no formData
  const disciplinaSelecionada = disciplinas.find(d => d.id === Number(formData.disciplina));
  const professorSelecionado = professores.find(p => p.id === Number(formData.professor));
  console.log(disciplinaSelecionada)
  console.log(professores)
  if (!disciplinaSelecionada || !professorSelecionado) {
    alert("Disciplina ou professor inválido.");
    return;
  }

  const dto = {
    disciplinaID: disciplinaSelecionada.id,
    professorID: professorSelecionado.id,
    vagasTotais: formData.vagasTotais,
    horario: formData.horario
  };

  try {
    const response = await fetch(`${apiUrl}/turmas`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(dto)
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar turma: ${response.status}`);
    }

    // Atualiza a lista de turmas após criação com sucesso
    const novaTurma: TurmaServ = await response.json();
    setTurmas([...turmas, novaTurma]);
    resetForm();
  } catch (error) {
    console.error("Erro ao criar a turma:", error);
  }
};

  const resetForm = () => {
    setFormData({ disciplina: '', professor: '', vagasTotais: 0,  horario: ''});
    setShowForm(false);
    setEditingTurma(null);
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setFormData({
      disciplina: turma.disciplina,
      professor: turma.professor,
      vagasTotais: turma.vagasTotais,
      horario: turma.horario
    
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      setTurmas(turmas.filter(turma => turma.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="text-purple-600 mr-3" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestão de Turmas</h1>
              <p className="text-sm text-gray-600">Gerencie as turmas e disciplinas</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Turma
          </button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingTurma ? 'Editar Turma' : 'Adicionar Nova Turma'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
              <select
                value={formData.disciplina}
                onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                required
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map((disc) => (
                  <option key={disc.id} value={disc.id}>
                    {disc.nome ?? 'Sem disciplina'}
                  </option>
                ))}
              </select>
            </div>
            <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
              <select
                value={formData.professor}
                onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                required
              >
                <option value="">Selecione um professor</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome ?? 'Sem professor'}
                  </option>
                ))}
              </select>
            </div>
          </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vagas totais</label>
              <input
                type="number"
                value={formData.vagasTotais}
                onChange={(e) => setFormData({...formData, vagasTotais: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
              <input
                type="text"
                value={formData.horario}
                onChange={(e) => setFormData({...formData, horario: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder="Ex: 08:00 - 10:00"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                {editingTurma ? 'Atualizar' : 'Adicionar'}
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

      {/* Lista de Turmas */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Lista de Turmas ({turmas.length})
        </h2>
        
        {turmas.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhuma turma cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turmas.map((turma) => (
              <div key={turma.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <BookOpen className="text-purple-500 mr-2" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">TURMA {turma.codigo} - {turma.disciplina.nome}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(turma.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      {turma.disciplina.nome}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">{turma.horario}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600 text-xs">
                      Professor: {turma.professor}
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

export default Turmas;
