import { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Edit, Trash2, Plus, User, Mail, X } from "lucide-react";

interface Professor {
  id: number;
  nome: string;
  cpf: string;
  emailPessoal: string;
  emailInstitucional: string;
  departamento: string;
  telefone: string;
  siape: string;
}

interface ProfessorFormData {
  nome: string;
  emailInstitucional: string;
  emailPessoal: string;
  siape: string;
  cpf: string;
  departamento: string;
  telefone: string;
}

// Interface para os erros de validação do formulário
interface ProfessorFormErrors {
  nome?: string;
  emailInstitucional?: string;
  emailPessoal?: string;
  siape?: string;
  cpf?: string;
  departamento?: string;
  telefone?: string;
  submit?: string; // Para erros gerais de submissão/API
}

const initialFormData: ProfessorFormData = {
  nome: '',
  emailInstitucional: '',
  emailPessoal: '',
  siape: '',
  cpf: '',
  departamento: '',
  telefone: '',
};

const apiUrl = import.meta.env.VITE_URL_API;

const Professores = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [formData, setFormData] = useState<ProfessorFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Erro para a lista de professores
  const [formErrors, setFormErrors] = useState<ProfessorFormErrors>({}); // NOVO: Erros para o formulário

  // Estado para o CPF formatado na exibição
  const [cpfFormated, setCpfFormated] = useState('');
  // Estado para o telefone formatado na exibição
  const [telefoneFormated, setTelefoneFormated] = useState('');
  // Estado para o siape formatado na exibição (apenas números)
  const [siapeFormated, setSiapeFormated] = useState('');

  // Funções de formatação
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numbers.length > 6) {
      return numbers.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (numbers.length > 3) {
      return numbers.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    return numbers;
  };

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 11) return numbers.slice(0, 11); // Limita a 11 dígitos
    return numbers.replace(/^(\d{2})(\d)/g, '($1) $2') // Adiciona parênteses ao DDD
      .replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen
  };

  const formatSiape = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 7) return numbers.slice(0, 7); // Limita a 7 dígitos
    return numbers;
  };

  // Função de validação do formulário
  const validateForm = () => {
    let newErrors: ProfessorFormErrors = {};
    let isValid = true;

    // Validações para campos de ADIÇÃO (todos obrigatórios e com formato específico)
    if (!editingProfessor) {
      if (!formData.nome.trim()) { newErrors.nome = 'Nome completo é obrigatório.'; isValid = false; }
      if (!formData.cpf.trim()) {
        newErrors.cpf = 'CPF é obrigatório.'; isValid = false;
      } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
        newErrors.cpf = 'CPF deve conter 11 dígitos.'; isValid = false;
      }
      if (!formData.emailInstitucional.trim()) {
        newErrors.emailInstitucional = 'Email institucional é obrigatório.'; isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.emailInstitucional)) {
        newErrors.emailInstitucional = 'Email institucional inválido.'; isValid = false;
      }
      if (!formData.siape.trim()) {
        newErrors.siape = 'SIAPE é obrigatório.'; isValid = false;
      } else if (!/^\d{7}$/.test(formData.siape)) {
        newErrors.siape = 'SIAPE deve conter 7 dígitos numéricos.'; isValid = false;
      }
    }

    // Validações para campos editáveis (aplicam-se tanto em adição quanto em edição)
    if (!formData.emailPessoal.trim()) {
      newErrors.emailPessoal = 'Email pessoal é obrigatório.'; isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.emailPessoal)) {
      newErrors.emailPessoal = 'Email pessoal inválido.'; isValid = false;
    }
    if (!formData.departamento.trim()) { newErrors.departamento = 'Departamento é obrigatório.'; isValid = false; }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório.'; isValid = false;
    } else if (formData.telefone.replace(/\D/g, '').length !== 11) {
      newErrors.telefone = 'Telefone deve conter 11 dígitos (incluindo DDD).'; isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const fetchProfessores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/professores`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));
        throw new Error(`Erro HTTP ${response.status}: ${errorData.message || 'Falha ao buscar professores.'}`);
      }

      const data: Professor[] = await response.json();
      setProfessores(data);
    } catch (err: any) {
      console.error("Erro ao buscar os professores:", err);
      setError(err.message || "Erro ao carregar lista de professores.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchProfessores();
  }, [fetchProfessores]);

  // Handler genérico para inputs, incluindo formatação e limpeza de erros
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Aplica formatação e atualiza estados auxiliares
    if (name === 'cpf') {
      const numbers = value.replace(/\D/g, '');
      setCpfFormated(formatCPF(numbers));
      newValue = numbers; // Armazena apenas números para o formData
    } else if (name === 'telefone') {
      setTelefoneFormated(formatTelefone(value));
      newValue = value.replace(/\D/g, ''); // Armazena apenas números para o formData
    } else if (name === 'siape') {
      setSiapeFormated(formatSiape(value));
      newValue = value.replace(/\D/g, ''); // Armazena apenas números para o formData
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Limpa o erro do campo assim que o usuário começa a digitar
    if (formErrors[name as keyof ProfessorFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ProfessorFormErrors];
        return newErrors;
      });
    }
    setFormErrors(prev => ({ ...prev, submit: undefined })); // Limpa erro de submit ao interagir
  };


  const resetForm = () => {
    setFormData(initialFormData);
    setCpfFormated('');
    setTelefoneFormated('');
    setSiapeFormated('');
    setShowForm(false);
    setEditingProfessor(null);
    setFormErrors({}); // Limpa todos os erros ao resetar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({}); // Limpa erros anteriores ao tentar submeter

    if (!validateForm()) {
      setSubmitting(false);
      return; // Impede o envio se a validação falhar
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token de autenticação não encontrado.");

      let res;
      let url: string;
      let method: string;
      let bodyData: any;

      if (editingProfessor) {
        url = `${apiUrl}/professores/${editingProfessor.id}`;
        method = "PUT";
        // Apenas campos editáveis são enviados no PUT
        bodyData = {
          departamento: formData.departamento,
          telefone: formData.telefone, // Já está limpo de formatação pelo handleInputChange
          emailPessoal: formData.emailPessoal
        };
      } else {
        url = `${apiUrl}/auth/register`;
        method = "POST";
        bodyData = {
          nome: formData.nome,
          cpf: formData.cpf, // Já está limpo de formatação
          emailPessoal: formData.emailPessoal,
          emailInstitucional: formData.emailInstitucional,
          telefone: formData.telefone, // Já está limpo de formatação
          senha: formData.cpf.substring(0, 4), // Senha inicial baseada no CPF
          aluno: null,
          professor: { siape: formData.siape, departamento: formData.departamento }, // Siape já está limpo
          papeis: ['PROFESSOR']
        };
      }

      res = await fetch(url, {
        method: method,
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      let responseData: any = {};
      const contentType = res.headers.get('content-type');
      if (res.status !== 204 && contentType && contentType.includes('application/json')) {
        try {
          responseData = await res.json();
        } catch (jsonParseError) {
          console.warn("Aviso: Falha ao parsear JSON, mas o Content-Type indicava JSON. Corpo pode estar vazio ou malformado.", jsonParseError);
          responseData = { message: await res.text().catch(() => 'Corpo vazio ou ilegível.') };
        }
      } else if (res.status === 201 || res.status === 204) {
        responseData = { message: 'Operação realizada com sucesso (sem conteúdo de resposta).' };
      } else {
        responseData = { message: await res.text().catch(() => 'Corpo vazio ou ilegível.') };
      }

      if (!res.ok) {
        throw new Error(responseData.message || `Erro ${res.status}: Falha na operação.`);
      }

      alert(`Professor ${editingProfessor ? 'atualizado' : 'adicionado'} com sucesso!`);
      resetForm();
      fetchProfessores();
    } catch (err: any) {
      console.error("Erro ao processar professor:", err);
      setFormErrors(prev => ({ ...prev, submit: err.message || "Erro na operação. Verifique os dados e tente novamente." }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setFormData({
      nome: professor.nome,
      emailInstitucional: professor.emailInstitucional,
      emailPessoal: professor.emailPessoal,
      siape: professor.siape,
      cpf: professor.cpf,
      departamento: professor.departamento,
      telefone: professor.telefone
    });
    // Define os estados formatados para exibição
    setCpfFormated(formatCPF(professor.cpf));
    setTelefoneFormated(formatTelefone(professor.telefone));
    setSiapeFormated(formatSiape(professor.siape));

    setShowForm(true);
    setFormErrors({}); // Limpa erros ao abrir para edição
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este professor? Esta ação é irreversível.')) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");

      const response = await fetch(`${apiUrl}/professores/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido.' }));
        throw new Error(errorData.message || `Erro ${response.status}: Falha ao excluir professor.`);
      }

      alert("Professor excluído com sucesso!");
      fetchProfessores();
    } catch (err: any) {
      console.error("Erro ao excluir professor:", err);
      alert(err.message || "Erro ao excluir professor. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        Carregando professores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow">
        <p className="font-bold">Erro ao carregar professores:</p>
        <p>{error}</p>
      </div>
    );
  }

  // Lógica para desabilitar e estilizar campos
  const isEditing = !!editingProfessor; // true se estiver editando, false se adicionando

  // Função auxiliar para classes CSS de campos desabilitados
  const getDisabledClass = (fieldName: keyof ProfessorFormData) => {
    // Campos desabilitados na edição: nome, cpf, emailInstitucional, siape
    return isEditing && (fieldName === 'nome' || fieldName === 'cpf' || fieldName === 'emailInstitucional' || fieldName === 'siape') ? 'bg-gray-100 cursor-not-allowed' : '';
  };
  // Função auxiliar para o atributo disabled
  const getDisabledAttr = (fieldName: keyof ProfessorFormData) => {
    return isEditing && (fieldName === 'nome' || fieldName === 'cpf' || fieldName === 'emailInstitucional' || fieldName === 'siape');
  };
  // Função auxiliar para o atributo required
  const getRequiredAttr = (fieldName: keyof ProfessorFormData) => {
    // Se estiver adicionando (não editando), todos os campos são obrigatórios.
    // Se estiver editando, apenas emailPessoal, departamento e telefone são obrigatórios.
    if (!isEditing) {
      return true;
    } else {
      return (fieldName === 'emailPessoal' || fieldName === 'departamento' || fieldName === 'telefone');
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
            onClick={() => { setShowForm(true); setEditingProfessor(null); resetForm(); }} // Limpa o formulário e erros ao clicar em "Adicionar"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Professor
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingProfessor ? 'Editar Professor' : 'Adicionar Novo Professor'}
            </h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-green-500 ${getDisabledClass('nome')} ${formErrors.nome ? 'border-red-500' : 'border-gray-300'}`}
                required={getRequiredAttr('nome')}
                disabled={getDisabledAttr('nome')}
              />
              {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal *</label>
              <input
                type="email"
                name="emailPessoal"
                value={formData.emailPessoal}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-green-500 ${formErrors.emailPessoal ? 'border-red-500' : 'border-gray-300'}`}
                required={getRequiredAttr('emailPessoal')}
                disabled={getDisabledAttr('emailPessoal')}
              />
              {formErrors.emailPessoal && <p className="text-red-500 text-xs mt-1">{formErrors.emailPessoal}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional *</label>
              <input
                type="email"
                name="emailInstitucional"
                value={formData.emailInstitucional}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-green-500 ${getDisabledClass('emailInstitucional')} ${formErrors.emailInstitucional ? 'border-red-500' : 'border-gray-300'}`}
                required={getRequiredAttr('emailInstitucional')}
                disabled={getDisabledAttr('emailInstitucional')}
              />
              {formErrors.emailInstitucional && <p className="text-red-500 text-xs mt-1">{formErrors.emailInstitucional}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-green-500 ${formErrors.departamento ? 'border-red-500' : 'border-gray-300'}`}
                required={getRequiredAttr('departamento')}
                disabled={getDisabledAttr('departamento')}
              />
              {formErrors.departamento && <p className="text-red-500 text-xs mt-1">{formErrors.departamento}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SIAPE *</label>
              <input
                type="text"
                name="siape"
                value={siapeFormated} // Usa o estado formatado
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-green-500 ${getDisabledClass('siape')} ${formErrors.siape ? 'border-red-500' : 'border-gray-300'}`}
                required={getRequiredAttr('siape')}
                disabled={getDisabledAttr('siape')}
                maxLength={7} // Limita a entrada
              />
              {formErrors.siape && <p className="text-red-500 text-xs mt-1">{formErrors.siape}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <input
                type="tel" // Tipo tel para melhor UX em mobile
                name="telefone"
                value={telefoneFormated} // Usa o estado formatado
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-green-500 ${formErrors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="(00) 00000-0000"
                maxLength={15} // (00) 00000-0000 tem 15 caracteres
                required={getRequiredAttr('telefone')}
                disabled={getDisabledAttr('telefone')}
              />
              {formErrors.telefone && <p className="text-red-500 text-xs mt-1">{formErrors.telefone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
              <input
                type="text"
                name="cpf"
                value={cpfFormated} // Usa o estado formatado
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border-2 rounded focus:border-green-500 ${getDisabledClass('cpf')} ${formErrors.cpf ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ex: 000.000.000-00"
                maxLength={14} // Limita a entrada
                required={getRequiredAttr('cpf')}
                disabled={getDisabledAttr('cpf')}
              />
              {formErrors.cpf && <p className="text-red-500 text-xs mt-1">{formErrors.cpf}</p>}
            </div>
            {formErrors.submit && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                {formErrors.submit}
              </div>
            )}
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (editingProfessor ? 'Atualizando...' : 'Adicionando...') : (editingProfessor ? 'Atualizar' : 'Adicionar')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
                    <span className="text-gray-600">Ins: {professor.emailInstitucional}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600">Pessoal: {professor.emailPessoal}</span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {professor.departamento}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600 text-xs">Tel: {formatTelefone(professor.telefone)}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600 text-xs">SIAPE: {formatSiape(professor.siape)}</span>
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
