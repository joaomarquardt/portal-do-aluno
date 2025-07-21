import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Clock, Edit, Trash2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_URL_API;

interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
  periodo: number;
  cargaHoraria: number;
  cursoId: number;
}

interface Curso {
  id: number;
  nome: string;
  tipo: string;
  anosDuracao: number;
  turno: string;
  departamento: string;
}

interface DisciplinaFormData {
  nome: string;
  codigo: string;
  periodo: string;
  cargaHoraria: string;
  cursoId: number | '';
}

const initialFormData: DisciplinaFormData = {
  nome: '',
  codigo: '',
  periodo: '',
  cargaHoraria: '',
  cursoId: '',
};

const Disciplinas = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [formData, setFormData] = useState<DisciplinaFormData>(initialFormData);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);


  const fetchDisciplinas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/disciplinas`, {
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      setDisciplinas(response.data);
    } catch (err: any) {
      console.error("Erro ao buscar as Disciplinas:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erro ${err.response?.status}: Falha ao buscar disciplinas.`);
      } else {
        setError('Ocorreu um erro inesperado ao buscar disciplinas.');
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const fetchCursos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Curso[]>(`${apiUrl}/cursos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      setCursos(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar os cursos:', err);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchDisciplinas();
    fetchCursos();
  }, [fetchDisciplinas, fetchCursos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (!formData.nome || !formData.codigo || !formData.periodo || !formData.cargaHoraria || formData.cursoId === '') {
        setFormError("Por favor, preencha todos os campos obrigatórios.");
        setSubmitting(false);
        return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token de autenticação não encontrado.");

      let res;
      let url: string;
      let method: string;
      let bodyData: any;

      if (editingDisciplina) {
        url = `${apiUrl}/disciplinas/${editingDisciplina.id}`;
        method = "PUT";
        bodyData = {
          id: editingDisciplina.id,
          codigo: formData.codigo,
          nome: formData.nome,
          periodo: Number(formData.periodo),
          cargaHoraria: Number(formData.cargaHoraria),
          cursoId: Number(formData.cursoId),
        };
      } else {
        url = `${apiUrl}/disciplinas`;
        method = "POST";
        bodyData = {
          codigo: formData.codigo,
          nome: formData.nome,
          periodo: Number(formData.periodo),
          cargaHoraria: Number(formData.cargaHoraria),
          cursoId: Number(formData.cursoId),
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
          console.warn("Aviso: Falha ao parsear JSON. Corpo pode estar vazio ou malformado.", jsonParseError);
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

      alert(`Disciplina ${editingDisciplina ? 'atualizada' : 'adicionada'} com sucesso!`);
      resetForm();
      fetchDisciplinas();
    } catch (err: any) {
      console.error("Erro ao processar Disciplina:", err);
      setFormError(err.message || "Erro na operação. Verifique os dados e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEditingDisciplina(null);
    setFormError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    if (name === 'periodo' || name === 'cargaHoraria' || name === 'cursoId') {
      processedValue = Number(value);
      if (value === '') {
        processedValue = '';
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleEdit = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      periodo: String(disciplina.periodo),
      cargaHoraria: String(disciplina.cargaHoraria),
      cursoId: disciplina.cursoId,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta Disciplina? Esta ação é irreversível.')) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticação não encontrado.");

      const response = await axios.delete(`${apiUrl}/disciplinas/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (response.status !== 200 && response.status !== 204) {
        throw new Error(`Erro HTTP ${response.status}: Falha ao excluir disciplina.`);
      }

      alert("Disciplina excluída com sucesso!");
      fetchDisciplinas();
    } catch (err: any) {
      console.error("Erro ao excluir Disciplina:", err);
      alert(err.message || "Erro ao excluir Disciplina. Tente novamente.");
    }
  };

  const isEditing = !!editingDisciplina;

  const getDisabledClass = (fieldName: string) => {
    if (isEditing && (fieldName === 'nome' || fieldName === 'codigo')) {
        return 'bg-gray-100 cursor-not-allowed';
    }
    return '';
  };
  const getDisabledAttr = (fieldName: string) => {
    if (isEditing && (fieldName === 'nome' || fieldName === 'codigo')) {
        return true;
    }
    return false;
  };
  const getRequiredAttr = (fieldName: string) => {
      return !getDisabledAttr(fieldName);
  };


  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        Carregando disciplinas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow">
        <p className="font-bold">Erro ao carregar disciplinas:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="text-purple-600 mr-3" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestão de Disciplinas</h1>
              <p className="text-sm text-gray-600">Gerencie as Disciplinas e códigos</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Disciplina
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border-2 border-purple-300 rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingDisciplina ? 'Editar Disciplina' : 'Adicionar Nova Disciplina'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Disciplina</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500 ${getDisabledClass('nome')}`}
                placeholder='Cálculo'
                required={getRequiredAttr('nome')}
                disabled={getDisabledAttr('nome')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500 ${getDisabledClass('codigo')}`}
                placeholder='ABC123'
                required={getRequiredAttr('codigo')}
                disabled={getDisabledAttr('codigo')}
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carga horária total</label>
                <input
                    type="number"
                    name="cargaHoraria"
                    value={formData.cargaHoraria}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500 ${getDisabledClass('cargaHoraria')}`}
                    placeholder="60/120"
                    required={getRequiredAttr('cargaHoraria')}
                    disabled={getDisabledAttr('cargaHoraria')}
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período mínimo na qual essa disciplina estará disponível *</label>
              <input
                type="number"
                name="periodo"
                value={formData.periodo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500 ${getDisabledClass('periodo')}`}
                placeholder="1"
                required={getRequiredAttr('periodo')}
                disabled={getDisabledAttr('periodo')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curso da Disciplina *</label>
              <select
                name="cursoId"
                value={formData.cursoId}
                onChange={handleChange}
                required={getRequiredAttr('cursoId')}
                disabled={getDisabledAttr('cursoId')}
                className={`w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500 ${getDisabledClass('cursoId')}`}
              >
                <option value="">Selecione um curso</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome} — {curso.departamento || 'Sem departamento'}
                  </option>
                ))}
              </select>
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
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (editingDisciplina ? 'Atualizando...' : 'Adicionando...') : (editingDisciplina ? 'Atualizar' : 'Adicionar')}
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
          Lista de Disciplinas ({disciplinas.length})
        </h2>

        {disciplinas.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhuma Disciplina cadastrada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disciplinas.map((disciplina) => (
              <div key={disciplina.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 m-2 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <BookOpen className="text-purple-500 mr-2" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">{disciplina.nome}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(disciplina)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(disciplina.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      CÓDIGO: {disciplina.codigo}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-gray-500 mr-2" size={16} />
                    <span className="text-gray-600"> CARGA HORÁRIA: {disciplina.cargaHoraria} hrs</span>
                  </div>
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Período mínimo de inscrição: {disciplina.periodo}
                    </span>
                  </div>
                  {disciplina.cursoId && (
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                          Curso: {cursos.find(c => c.id === disciplina.cursoId)?.nome || 'N/A'}
                        </span>
                      </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Disciplinas;
