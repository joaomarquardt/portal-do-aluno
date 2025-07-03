
import { useState } from 'react';
import { BookOpen, Users, Calendar, Edit, Trash2, Plus, Clock } from "lucide-react";

interface Turma {
  id: number;
  nome: string;
  disciplina: string;
  professor: string;
  alunos: number;
  semestre: string;
  horario: string;
  sala: string;
}

const Turmas = () => {
  const [turmas, setTurmas] = useState<Turma[]>([
    {
      id: 1,
      nome: "Turma A - Matemática I",
      disciplina: "Matemática I",
      professor: "Prof. João Silva",
      alunos: 25,
      semestre: "2024.1",
      horario: "08:00 - 10:00",
      sala: "A101"
    },
    {
      id: 2,
      nome: "Turma B - História",
      disciplina: "História do Brasil",
      professor: "Profa. Maria Santos",
      alunos: 30,
      semestre: "2024.1",
      horario: "14:00 - 16:00",
      sala: "B205"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    disciplina: '',
    professor: '',
    alunos: 0,
    semestre: '',
    horario: '',
    sala: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTurma) {
      setTurmas(turmas.map(turma => 
        turma.id === editingTurma.id 
          ? { ...turma, ...formData }
          : turma
      ));
    } else {
      const newTurma = {
        id: Math.max(...turmas.map(t => t.id), 0) + 1,
        ...formData
      };
      setTurmas([...turmas, newTurma]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', disciplina: '', professor: '', alunos: 0, semestre: '', horario: '', sala: '' });
    setShowForm(false);
    setEditingTurma(null);
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setFormData({
      nome: turma.nome,
      disciplina: turma.disciplina,
      professor: turma.professor,
      alunos: turma.alunos,
      semestre: turma.semestre,
      horario: turma.horario,
      sala: turma.sala
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
              <input
                type="text"
                value={formData.disciplina}
                onChange={(e) => setFormData({...formData, disciplina: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
              <input
                type="text"
                value={formData.professor}
                onChange={(e) => setFormData({...formData, professor: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Alunos</label>
              <input
                type="number"
                value={formData.alunos}
                onChange={(e) => setFormData({...formData, alunos: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
              <input
                type="text"
                value={formData.semestre}
                onChange={(e) => setFormData({...formData, semestre: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder="Ex: 2024.1"
                required
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sala</label>
              <input
                type="text"
                value={formData.sala}
                onChange={(e) => setFormData({...formData, sala: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
                placeholder="Ex: A101"
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
                    <h3 className="text-lg font-bold text-gray-800">{turma.nome}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(turma)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit size={16} />
                    </button>
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
                      {turma.disciplina}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">{turma.alunos} alunos</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">{turma.horario}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">Sala: {turma.sala}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600 text-xs">
                      Professor: {turma.professor}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {turma.semestre}
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
