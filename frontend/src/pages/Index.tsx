
import { useState } from 'react';
import { Users, MessageSquarePlus, X } from "lucide-react";
import StudentCard from '../components/StudentCard';
import AddStudentForm from '../components/AddStudentForm';
import Stats from '../components/Stats';

interface Student {
  id: number;
  name: string;
  email: string;
  major: string;
  year: string;
  gpa: number;
}

interface Comunicado {
  id: number;
  titulo: string;
  mensagem: string;
  data: string;
  autor: string;
}

const Index = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@faculdade.edu.br",
      major: "Ciência da Computação",
      year: "3º",
      gpa: 3.7
    },
    {
      id: 2,
      name: "Sarah Santos",
      email: "sarah.s@faculdade.edu.br",
      major: "Administração",
      year: "4º",
      gpa: 3.9
    },
    {
      id: 3,
      name: "Miguel Wilson",
      email: "miguel.w@faculdade.edu.br",
      major: "Engenharia",
      year: "2º",
      gpa: 3.2
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@faculdade.edu.br",
      major: "Psicologia",
      year: "1º",
      gpa: 3.5
    }
  ]);

  const [comunicados, setComunicados] = useState<Comunicado[]>([
    {
      id: 1,
      titulo: "Bem-vindos ao semestre 2024.1",
      mensagem: "Desejamos a todos um excelente semestre letivo!",
      data: "2024-01-15",
      autor: "Administração"
    }
  ]);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComunicadoForm, setShowComunicadoForm] = useState(false);
  const [comunicadoForm, setComunicadoForm] = useState({ titulo: '', mensagem: '' });

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent = {
      ...studentData,
      id: Math.max(...students.map(s => s.id), 0) + 1
    };
    setStudents([...students, newStudent]);
    console.log('Estudante adicionado:', newStudent);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setEditingStudent(null);
    console.log('Estudante atualizado:', updatedStudent);
  };

  const deleteStudent = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este estudante?')) {
      setStudents(students.filter(student => student.id !== id));
      console.log('Estudante excluído com id:', id);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComunicadoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComunicado = {
      id: Math.max(...comunicados.map(c => c.id), 0) + 1,
      titulo: comunicadoForm.titulo,
      mensagem: comunicadoForm.mensagem,
      data: new Date().toISOString().split('T')[0],
      autor: "Administração"
    };
    setComunicados([newComunicado, ...comunicados]);
    setComunicadoForm({ titulo: '', mensagem: '' });
    setShowComunicadoForm(false);
    alert('Comunicado criado com sucesso!');
  };

  const deleteComunicado = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este comunicado?')) {
      setComunicados(comunicados.filter(c => c.id !== id));
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Statistics */}
      <Stats students={students} />

      {/* Comunicados Section */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Comunicados</h2>
          <button
            onClick={() => setShowComunicadoForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <MessageSquarePlus size={16} />
            Criar Comunicado
          </button>
        </div>

        {/* Form para Comunicado */}
        {showComunicadoForm && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">Novo Comunicado</h3>
              <button
                onClick={() => setShowComunicadoForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleComunicadoSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={comunicadoForm.titulo}
                  onChange={(e) => setComunicadoForm({...comunicadoForm, titulo: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea
                  value={comunicadoForm.mensagem}
                  onChange={(e) => setComunicadoForm({...comunicadoForm, mensagem: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 h-24"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Enviar Comunicado
                </button>
                <button
                  type="button"
                  onClick={() => setShowComunicadoForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Comunicados */}
        <div className="space-y-3">
          {comunicados.map((comunicado) => (
            <div key={comunicado.id} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{comunicado.titulo}</h4>
                  <p className="text-gray-600 mt-1">{comunicado.mensagem}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {comunicado.autor} - {new Date(comunicado.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => deleteComunicado(comunicado.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Student Form */}
      <AddStudentForm 
        onAddStudent={addStudent}
        editingStudent={editingStudent}
        onUpdateStudent={updateStudent}
        onCancel={() => setEditingStudent(null)}
      />

      {/* Search Bar */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Estudantes
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busque por nome, email ou curso..."
          className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Students List */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Lista de Estudantes ({filteredStudents.length})
          </h2>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">
              {searchTerm ? 'Nenhum estudante encontrado.' : 'Nenhum estudante cadastrado ainda.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={handleEdit}
                onDelete={deleteStudent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
