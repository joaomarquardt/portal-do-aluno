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
  onAddAluno?: (aluno: Omit<Aluno, 'id'>) => void;
  editingAluno?: Aluno | null;
  onUpdateAluno?: (aluno: Aluno) => void;
  onCancel?: () => void;
}

const apiUrl = import.meta.env.VITE_URL_API;

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
  onAddAluno,
}: AddAlunoFormProps) => {
  const [formData, setFormData] = useState<Omit<Aluno, 'id'>>(initialFormState);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(true); // Controla a visibilidade do campo de senha

  useEffect(() => {
    if (editingAluno) {
      const { id, ...data } = editingAluno;
      setFormData(data);
      setShowPasswordInput(false); // Oculta a senha ao editar
    } else {
      setFormData(initialFormState);
      setShowPasswordInput(true); // Mostra a senha ao adicionar novo aluno
    }
    setErrors({}); // Limpa os erros ao iniciar edição ou adicionar
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
        // Opcional: Adicionar erro para o usuário se os cursos não carregarem
      }
    };
    fetchCursos();
  }, []);

  const formatCPF = (value: string) => {
    value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11);
    return value.replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatTelefone = (value: string) => {
    value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 11) value = value.slice(0, 11);
    return value.replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const validate = () => {
    let tempErrors: { [key: string]: string } = {};
    let isValid = true;

    // Validação de campos obrigatórios
    if (!formData.cpf.trim()) {
      tempErrors.cpf = 'CPF é obrigatório.';
      isValid = false;
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      tempErrors.cpf = 'CPF deve conter 11 dígitos.';
      isValid = false;
    }

    if (!formData.nome.trim()) {
      tempErrors.nome = 'Nome completo é obrigatório.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email pessoal é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email pessoal inválido.';
      isValid = false;
    }

    if (!formData.emailInstitucional.trim()) {
      tempErrors.emailInstitucional = 'Email institucional é obrigatório.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.emailInstitucional)) {
      tempErrors.emailInstitucional = 'Email institucional inválido.';
      isValid = false;
    }

    if (!formData.telefone.trim()) {
      tempErrors.telefone = 'Telefone é obrigatório.';
      isValid = false;
    } else if (formData.telefone.replace(/\D/g, '').length !== 11) {
      tempErrors.telefone = 'Telefone deve conter 11 dígitos (incluindo DDD).';
      isValid = false;
    }

    if (showPasswordInput && !(formData as any).senha?.trim()) { // Apenas valida senha se o campo estiver visível
      tempErrors.senha = 'Senha é obrigatória.';
      isValid = false;
    }

    if (formData.CursoId === 0) {
      tempErrors.CursoId = 'Selecione um curso.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatTelefone(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'CursoId' ? Number(formattedValue) : formattedValue,
    }));

    // Limpar erro ao começar a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return; // Impede o envio se a validação falhar
    }

    if (editingAluno && onUpdateAluno) {
      onUpdateAluno({ ...editingAluno, ...formData });
    } else if (onAddAluno) {
      try {
        const payload = {
          nome: formData.nome,
          cpf: formData.cpf.replace(/\D/g, ''), // Remove a formatação para o envio
          emailPessoal: formData.email,
          emailInstitucional: formData.emailInstitucional,
          telefone: formData.telefone.replace(/\D/g, ''), // Remove a formatação para o envio
          senha: (formData as any).senha,
          aluno: { cursoID: Number(formData.CursoId) },
          papeis: ['ALUNO'],
        };

        const res = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Erro HTTP: ${res.status}`);
        }
        
        onAddAluno(formData); // Chama a função onAddAluno após o sucesso
        setFormData(initialFormState); // Limpa o formulário
        setErrors({}); // Limpa os erros
      } catch (err: any) {
        console.error('Erro ao adicionar aluno:', err);
        setErrors(prev => ({ ...prev, submit: err.message || 'Erro ao adicionar aluno.' }));
      }
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        {editingAluno ? 'Editar Aluno' : 'Adicionar Aluno'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'cpf', label: 'CPF *', type: 'text', placeholder: '000.000.000-00', maxLength: 14 },
            { name: 'nome', label: 'Nome completo *', type: 'text', placeholder: 'Nome do aluno' },
            { name: 'email', label: 'Email Pessoal *', type: 'email', placeholder: 'email@gmail.com' },
            { name: 'emailInstitucional', label: 'Email Institucional *', type: 'email', placeholder: 'aluno@universidade.edu' },
            { name: 'telefone', label: 'Telefone *', type: 'text', placeholder: '(00) 00000-0000', maxLength: 15 },
          ].map(({ name, label, type, placeholder, maxLength }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={(formData as any)[name] || ''} // Garante que o valor não seja undefined
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border-2 rounded focus:outline-none ${errors[name] ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder={placeholder}
                maxLength={maxLength}
              />
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
          ))}

          {showPasswordInput && ( // Renderiza o campo de senha apenas se showPasswordInput for true
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
              <input
                type="password"
                name="senha"
                value={(formData as any).senha || ''}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border-2 rounded focus:outline-none ${errors.senha ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                placeholder="Senha"
              />
              {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curso *</label>
            <select
              name="CursoId"
              value={formData.CursoId}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border-2 rounded focus:outline-none ${errors.CursoId ? 'border-red-500' : 'border-gray-300 focus:border-purple-500'}`}
            >
              <option value={0}>Selecione um curso</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome} — {curso.departamento || 'Sem departamento'}
                </option>
              ))}
            </select>
            {errors.CursoId && <p className="text-red-500 text-xs mt-1">{errors.CursoId}</p>}
          </div>
        </div>

        {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}

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
              onClick={() => {
                onCancel();
                setErrors({}); // Limpa os erros ao cancelar
              }}
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