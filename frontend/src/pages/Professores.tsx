import { useState, useEffect, useCallback } from 'react';
import { GraduationCap, Edit, Trash2, Plus, User, Mail, BookOpen, X } from "lucide-react";
import test from 'node:test';

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
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [cpfFormated, setCpfFormated] = useState('');
  const [cellphoneFormated, setCellphoneFormated] = useState('');
  const [siapeFormated, setSiapeFormated] = useState('');

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

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
    const formatCellphone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      setCpfFormated(formatCPF(numbers));
      setFormData(prev => ({ ...prev, cpf: numbers }));
    }
  };

    const handleCellphoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      setCellphoneFormated(formatCellphone(numbers));
      setFormData(prev => ({ ...prev, telefone: numbers }));
    }
  };

    const handleSiapeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 6) {
      setSiapeFormated(formatSiape(numbers));
      setFormData(prev => ({ ...prev, siape: numbers }));
    }
  };

  const formatSiape = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(\d{2})/, '$1-$2');
  };


  const resetForm = () => {
    setFormData(initialFormData);
    setCpfFormated('');
    setShowForm(false);
    setEditingProfessor(null);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

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
        bodyData = {
          departamento: formData.departamento,
          telefone: formData.telefone,
          emailPessoal: formData.emailPessoal
        };
      } else {
        url = `${apiUrl}/auth/register`;
        method = "POST";
        bodyData = {
          nome: formData.nome,
          cpf: formData.cpf,
          emailPessoal: formData.emailPessoal,
          emailInstitucional: formData.emailInstitucional,
          telefone: formData.telefone,
          senha: formData.cpf.substring(0, 4),
          aluno: null,
          professor: { siape: formData.siape, departamento: formData.departamento },
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
      setFormError(err.message || "Erro na operação. Verifique os dados e tente novamente.");
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
    setCpfFormated(formatCPF(professor.cpf));
    setShowForm(true);
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
  const isEditing = !!editingProfessor;

  const getDisabledClass = (fieldToExclude: string) => {
    return isEditing && !['emailPessoal', 'departamento'].includes(fieldToExclude) ? 'bg-gray-100 cursor-not-allowed' : '';
  };
  const getDisabledAttr = (fieldToExclude: string) => {
    return isEditing && !['emailPessoal', 'departamento'].includes(fieldToExclude);
  };
  const getRequiredAttr = (fieldToExclude: string, isOptional: boolean = false) => {
      return !isEditing && !isOptional;
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
                onChange={(e) => setFormData(prev => ({...prev, nome: e.target.value}))}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500 ${getDisabledClass('nome')}`}
                required={getRequiredAttr('nome')}
                disabled={getDisabledAttr('nome')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal *</label>
              <input
                type="email"
                name="emailPessoal"
                value={formData.emailPessoal}
                onChange={(e) => setFormData(prev => ({...prev, emailPessoal: e.target.value}))}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500 ${getDisabledClass('emailPessoal')}`}
                required={getRequiredAttr('emailPessoal')}
                disabled={getDisabledAttr('emailPessoal')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Institucional *</label>
              <input
                type="email"
                name="emailInstitucional"
                value={formData.emailInstitucional}
                onChange={(e) => setFormData(prev => ({...prev, emailInstitucional: e.target.value}))}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500 ${getDisabledClass('emailInstitucional')}`}
                required={getRequiredAttr('emailInstitucional')}
                disabled={getDisabledAttr('emailInstitucional')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
              <input
                type="text"
                name="departamento"
                value={formData.departamento}
                onChange={(e) => setFormData(prev => ({...prev, departamento: e.target.value}))}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500 ${getDisabledClass('departamento')}`}
                required={getRequiredAttr('departamento')}
                disabled={getDisabledAttr('departamento')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SIAPE *</label>
              <input
                type="text"
                name="siape"
                value={siapeFormated}
                onChange={handleSiapeChange}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500 ${getDisabledClass('siape')}`}
                required={getRequiredAttr('siape')}
                disabled={getDisabledAttr('siape')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <input
                type="tel"
                name="telefone"
                value={cellphoneFormated}
                onChange={handleCellphoneChange}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500`}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
              <input
                type="text"
                name="cpf"
                value={cpfFormated}
                onChange={handleCPFChange}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-green-500 ${getDisabledClass('cpf')}`}
                placeholder="Ex: 000.000.000-00"
                maxLength={14}
                required={getRequiredAttr('cpf')}
                disabled={getDisabledAttr('cpf')}
              />
            </div>
            {formError && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                {formError}
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
                    <span className="text-gray-600 text-xs">Tel: {professor.telefone}</span>
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
