
import { useState } from 'react';
import { GraduationCap, Edit, Trash2, Plus, User, Mail, BookOpen } from "lucide-react";

interface Professor {
  id: number;
  nome: string;
  email: string;
  departamento: string;
  telefone: string;
  disciplinas: string[];
}

const Professores = () => {
  const [professores, setProfessores] = useState<Professor[]>([
    {
      id: 1,
      nome: "Prof. João Silva",
      email: "joao.silva@faculdade.edu.br",
      departamento: "Matemática",
      telefone: "(11) 98765-4321",
      disciplinas: ["Cálculo I", "Álgebra Linear"]
    },
    {
      id: 2,
      nome: "Profa. Maria Santos",
      email: "maria.santos@faculdade.edu.br",
      departamento: "História",
      telefone: "(11) 98765-1234",
      disciplinas: ["História do Brasil", "História Geral"]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    departamento: '',
    telefone: '',
    disciplinas: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const disciplinasArray = formData.disciplinas.split(',').map(d => d.trim()).filter(d => d);
    
    if (editingProfessor) {
      setProfessores(professores.map(prof => 
        prof.id === editingProfessor.id 
          ? { ...prof, ...formData, disciplinas: disciplinasArray }
          : prof
      ));
    } else {
      const newProfessor = {
        id: Math.max(...professores.map(p => p.id), 0) + 1,
        ...formData,
        disciplinas: disciplinasArray
      };
      setProfessores([...professores, newProfessor]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', email: '', departamento: '', telefone: '', disciplinas: '' });
    setShowForm(false);
    setEditingProfessor(null);
  };

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setFormData({
      nome: professor.nome,
      email: professor.email,
      departamento: professor.departamento,
      telefone: professor.telefone,
      disciplinas: professor.disciplinas.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      setProfessores(professores.filter(prof => prof.id !== id));
    }
  };

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
            onClick={() => setShowForm(true)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input
                type="text"
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Disciplinas (separadas por vírgula)</label>
              <input
                type="text"
                value={formData.disciplinas}
                onChange={(e) => setFormData({...formData, disciplinas: e.target.value})}
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
                    <span className="text-gray-600">{professor.email}</span>
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
