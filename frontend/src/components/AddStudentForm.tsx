import { useState, useEffect } from 'react';

interface Student {
  id: number;
  cpf: string;
  name: string;
  email: string;
  institucionalEmail: string;
  cellphone: string;
  CursoId: number;
}

interface Curso {
  id: string;
  nome: string;
  tipo: string;
  anosDuracao: number;
  turno: string;
  departamento: string;
}

interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  editingStudent?: Student | null;
  onUpdateStudent?: (student: Student) => void;
  onCancel?: () => void;
}

const initialFormState: Omit<Student, 'id'> = {
  cpf: '',
  name: '',
  email: '',
  institucionalEmail: '',
  cellphone: '',
  CursoId: 1,
};

const AddStudentForm = ({
  editingStudent,
  onUpdateStudent,
  onCancel,
}: AddStudentFormProps) => {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);
  const [cursos, setCursos] = useState<Curso[]>([]);

  
  useEffect(() => {
    if (editingStudent) {
      const { id, ...data } = editingStudent;
      setFormData(data);
    }
  }, [editingStudent]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch('http://localhost:3000/Cursos', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        const data: Curso[] = await res.json();
        setCursos(data);
      } catch (error) {
        console.error('Erro ao buscar os cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'CursoId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStudent && onUpdateStudent) {
      onUpdateStudent({ ...editingStudent, ...formData });
    } else {
      try {
        await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            nome: formData.name,
            cpf: formData.cpf,
            emailPessoal: formData.email,
            emailInstitucional: formData.institucionalEmail,
            telefone: formData.cellphone,
            senha: `${formData.cpf}`,
            aluno: { cursoID: Number(formData.CursoId) },
            papeis: ['ALUNO'],
          }),
        });
      } catch (err) {
        console.error('Erro ao adicionar aluno:', err);
      }
    }

    setFormData(initialFormState);
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {editingStudent ? 'Editar Aluno' : 'Adicionar Aluno'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'cpf', label: 'CPF *', type: 'text', placeholder: '000.000.000-00' },
            { name: 'name', label: 'Nome completo *', type: 'text', placeholder: 'Nome do aluno' },
            { name: 'email', label: 'Email Pessoal *', type: 'email', placeholder: 'email@gmail.com' },
            { name: 'institucionalEmail', label: 'Email Institucional *', type: 'email', placeholder: 'aluno@universidade.edu' },
            { name: 'cellphone', label: 'Telefone *', type: 'text', placeholder: '(00) 00000-0000' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                placeholder={placeholder}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curso *</label>
            <select
              name="CursoId"
              value={formData.CursoId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
            >
              <option value="">Selecione um curso</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome} — {curso.departamento || 'Sem departamento'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors font-medium"
          >
            {editingStudent ? 'Atualizar Aluno' : 'Adicionar Aluno'}
          </button>

          {editingStudent && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
