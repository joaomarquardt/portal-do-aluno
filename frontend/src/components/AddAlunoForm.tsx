import { useState, useEffect } from 'react';

interface Aluno {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  emailInstitucional: string;
  telefone: string;
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

interface AddAlunoFormProps {
  onAddAluno: (aluno: Omit<Aluno, 'id'>) => void;
  editingAluno?: Aluno | null;
  onUpdateAluno?: (aluno: Aluno) => void;
  onCancel?: () => void;
}

const apiUrl = import.meta.env.VITE_URL_API

const initialFormState: Omit<Aluno, 'id'> = {
  cpf: '',
  nome: '',
  email: '',
  emailInstitucional: '',
  telefone: '',
  CursoId: 0,
};

const AddAlunoForm = ({
  editingAluno,
  onUpdateAluno,
  onCancel,
}: AddAlunoFormProps) => {
  const [formData, setFormData] = useState<Omit<Aluno, 'id'>>(initialFormState);
  const [cursos, setCursos] = useState<Curso[]>([]);


  useEffect(() => {
    if (editingAluno) {
      const { id, ...data } = editingAluno;
      setFormData(data);
    }
  }, [editingAluno]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch(`${apiUrl}/cursos`, {
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

    if (editingAluno && onUpdateAluno) {
      onUpdateAluno({ ...editingAluno, ...formData });
    } else {
      try {
        await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            nome: formData.nome,
            cpf: formData.cpf,
            emailPessoal: formData.email,
            emailInstitucional: formData.emailInstitucional,
            telefone: formData.telefone,
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
        {editingAluno ? 'Editar Aluno' : 'Adicionar Aluno'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'cpf', label: 'CPF *', type: 'text', placeholder: '000.000.000-00' },
            { name: 'nome', label: 'Nome completo *', type: 'text', placeholder: 'Nome do aluno' },
            { name: 'email', label: 'Email Pessoal *', type: 'email', placeholder: 'email@gmail.com' },
            { name: 'emailInstitucional', label: 'Email Institucional *', type: 'email', placeholder: 'aluno@universidade.edu' },
            { name: 'telefone', label: 'Telefone *', type: 'text', placeholder: '(00) 00000-0000' },
            { name: 'senha', label: 'Senha *', type: 'password', placeholder: 'Senha' }
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
            {editingAluno ? 'Atualizar Aluno' : 'Adicionar Aluno'}
          </button>

          {editingAluno && onCancel && (
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

export default AddAlunoForm;
