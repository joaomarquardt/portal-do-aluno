import { useState } from 'react';
import { Users, MessageSquarePlus, X } from 'lucide-react';
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
    { id: 1, name: 'João Silva', email: 'joao.silva@faculdade.edu.br', major: 'Ciência da Computação', year: '3º', gpa: 3.7 },
    { id: 2, name: 'Sarah Santos', email: 'sarah.s@faculdade.edu.br', major: 'Administração', year: '4º', gpa: 3.9 },
    { id: 3, name: 'Miguel Wilson', email: 'miguel.w@faculdade.edu.br', major: 'Engenharia', year: '2º', gpa: 3.2 },
    { id: 4, name: 'Emma Davis', email: 'emma.davis@faculdade.edu.br', major: 'Psicologia', year: '1º', gpa: 3.5 },
  ]);

  const [comunicados, setComunicados] = useState<Comunicado[]>([
    {
      id: 1,
      titulo: 'Bem-vindos ao semestre 2024.1',
      mensagem: 'Desejamos a todos um excelente semestre letivo!',
      data: '2024-01-15',
      autor: 'Administração',
    },
  ]);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComunicadoForm, setShowComunicadoForm] = useState(false);
  const [comunicadoForm, setComunicadoForm] = useState({ titulo: '', mensagem: '' });

  // Helpers
  const getNextId = (list: { id: number }[]) => Math.max(0, ...list.map(item => item.id)) + 1;

  const addStudent = (data: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...data, id: getNextId(students) };
    setStudents(prev => [...prev, newStudent]);
    console.log('Estudante adicionado:', newStudent);
  };

  const updateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditingStudent(null);
    console.log('Estudante atualizado:', updated);
  };

  const deleteStudent = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este estudante?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      console.log('Estudante excluído:', id);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComunicadoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: Comunicado = {
      id: getNextId(comunicados),
      titulo: comunicadoForm.titulo,
      mensagem: comunicadoForm.mensagem,
      data: new Date().toISOString().split('T')[0],
      autor: 'Administração',
    };
    setComunicados(prev => [novo, ...prev]);
    setComunicadoForm({ titulo: '', mensagem: '' });
    setShowComunicadoForm(false);
    alert('Comunicado criado com sucesso!');
  };

  const deleteComunicado = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este comunicado?')) {
      setComunicados(prev => prev.filter(c => c.id !== id));
    }
  };

  const filteredStudents = students.filter(({ name, email, major }) =>
    [name, email, major].some(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <Stats students={students} />

      {/* Comunicados */}
      <section className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
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

        {showComunicadoForm && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">Novo Comunicado</h3>
              <button onClick={() => setShowComunicadoForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleComunicadoSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={comunicadoForm.titulo}
                  onChange={(e) => setComunicadoForm({ ...comunicadoForm, titulo: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea
                  value={comunicadoForm.mensagem}
                  onChange={(e) => setComunicadoForm({ ...comunicadoForm, mensagem: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 h-24"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Enviar
                </button>
                <button type="button" onClick={() => setShowComunicadoForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de comunicados */}
        <div className="space-y-3">
          {comunicados.map(({ id, titulo, mensagem, data, autor }) => (
            <div key={id} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{titulo}</h4>
                  <p className="text-gray-600 mt-1">{mensagem}</p>
                  <p className="text-sm text-gray-500 mt-2">{autor} - {new Date(data).toLocaleDateString('pt-BR')}</p>
                </div>
                <button onClick={() => deleteComunicado(id)} className="text-red-500 hover:text-red-700 ml-2">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AddStudentForm
        onAddStudent={addStudent}
        editingStudent={editingStudent}
        onUpdateStudent={updateStudent}
        onCancel={() => setEditingStudent(null)}
      />

      {/* Busca */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Estudantes</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busque por nome, email ou curso..."
          className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
        />
      </div>

      {/* Lista de Estudantes */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Lista de Estudantes ({filteredStudents.length})
          </h2>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
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
