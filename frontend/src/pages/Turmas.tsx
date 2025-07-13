import { useEffect, useState } from 'react';
import { BookOpen, Clock, Plus, Trash2, Edit, X } from "lucide-react";

interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
  periodo: number;
  cargaHoraria: number;
}

interface TurmaServ {
  id: number;
  codigo: string;
  horario: string;
  periodo: string;
  vagasTotais: number;
  professor: string; // Nome do professor
  disciplina: Disciplina;
}

interface Professor {
  id: number;
  nome: string;
}

// NOVO: Interface para os erros de validação do formulário de Turmas
interface TurmaFormErrors {
  disciplina?: string;
  professor?: string;
  vagasTotais?: string;
  horario?: string;
  submit?: string; // Para erros gerais de submissão/API
}

const apiUrl = import.meta.env.VITE_URL_API;

const Turmas = () => {
  const [turmas, setTurmas] = useState<TurmaServ[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTurma, setEditingTurma] = useState<TurmaServ | null>(null);

  const [formData, setFormData] = useState({
    disciplina: '', // ID da disciplina selecionada
    professor: '',   // ID do professor selecionado
    vagasTotais: 0,
    horario: '',
  });

  const [formErrors, setFormErrors] = useState<TurmaFormErrors>({}); // NOVO: Estado para erros de validação

  // === API Calls ===
  const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchProfessores = async () => {
    try {
      const res = await fetch(`${apiUrl}/professores/select`, {
        headers: authHeaders()
      });
      if (!res.ok) throw new Error(`Erro ao buscar professores: ${res.status}`);
      const data = await res.json();
      setProfessores(data);
    } catch (err) {
      console.error("Erro ao buscar professores:", err);
      // Opcional: setar um erro na UI para o usuário
    }
  };

  const fetchDisciplinas = async () => {
    try {
      const res = await fetch(`${apiUrl}/disciplinas`, {
        headers: authHeaders()
      });
      if (!res.ok) throw new Error(`Erro ao buscar disciplinas: ${res.status}`);
      const data = await res.json();
      setDisciplinas(data);
    } catch (err) {
      console.error("Erro ao buscar disciplinas:", err);
      // Opcional: setar um erro na UI para o usuário
    }
  };

  const fetchTurmas = async () => {
    try {
      const res = await fetch(`${apiUrl}/turmas`, {
        headers: authHeaders()
      });
      if (!res.ok) throw new Error(`Erro ao buscar turmas: ${res.status}`);
      const data = await res.json();
      // Mapeia turmas para garantir que o professor seja sempre o nome
      const formatadas = data.map((turma: any) => ({
        ...turma,
        professor: turma.professor?.nome || 'Desconhecido',
      }));
      setTurmas(formatadas);
    } catch (err) {
      console.error("Erro ao buscar turmas:", err);
      // Opcional: setar um erro na UI para o usuário
    }
  };

  useEffect(() => {
    fetchProfessores();
    fetchDisciplinas();
    fetchTurmas();
  }, []); // Adicione aqui as dependências que podem causar re-fetch, se necessário

  // === Form Management ===
  const resetForm = () => {
    setFormData({ disciplina: '', professor: '', vagasTotais: 0, horario: '' });
    setEditingTurma(null);
    setShowForm(false);
    setFormErrors({}); // NOVO: Limpa os erros do formulário
  };

  // Handler genérico para inputs e selects, incluindo limpeza de erros
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'vagasTotais' ? parseInt(value) || 0 : value,
    }));

    // Limpa o erro do campo assim que o usuário começa a interagir
    if (formErrors[name as keyof TurmaFormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof TurmaFormErrors];
        return newErrors;
      });
    }
    setFormErrors(prev => ({ ...prev, submit: undefined })); // Limpa erro de submit ao interagir
  };

  // NOVO: Função de validação
  const validateForm = () => {
    let newErrors: TurmaFormErrors = {};
    let isValid = true;

    if (!formData.disciplina) {
      newErrors.disciplina = 'Selecione uma disciplina.';
      isValid = false;
    }
    if (!formData.professor) {
      newErrors.professor = 'Selecione um professor.';
      isValid = false;
    }
    if (formData.vagasTotais <= 0) {
      newErrors.vagasTotais = 'O número de vagas deve ser maior que zero.';
      isValid = false;
    }
    if (!formData.horario.trim()) {
      newErrors.horario = 'O horário é obrigatório.';
      isValid = false;
    }
    // Opcional: Adicionar validação de formato de horário (regex)
    // Ex: if (!/^(\d{2}:\d{2} - \d{2}:\d{2})$/.test(formData.horario)) {
    //   newErrors.horario = 'Formato de horário inválido (HH:MM - HH:MM).'; isValid = false;
    // }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({}); // Limpa erros anteriores ao tentar submeter

    if (!validateForm()) {
      return; // Impede o envio se a validação falhar
    }

    const disciplinaID = Number(formData.disciplina);
    const professorID = Number(formData.professor);
    const dto = {
      disciplinaID,
      professorID,
      vagasTotais: formData.vagasTotais,
      horario: formData.horario,
    };

    try {
      let res;
      if (editingTurma) {
        // Lógica para UPDATE (PUT)
        res = await fetch(`${apiUrl}/turmas/${editingTurma.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(dto),
        });
      } else {
        // Lógica para CREATE (POST)
        res = await fetch(`${apiUrl}/turmas`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(dto),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
        throw new Error(errorData.message || `Erro ${res.status}: Falha na operação.`);
      }

      const turmaResponse = await res.json(); // Pode ser a turma atualizada ou a nova turma
      alert(`Turma ${editingTurma ? 'atualizada' : 'adicionada'} com sucesso!`);
      resetForm();
      fetchTurmas(); // Re-fetch para atualizar a lista com os dados mais recentes
    } catch (err: any) {
      console.error("Erro ao salvar turma:", err);
      setFormErrors(prev => ({ ...prev, submit: err.message || "Erro ao salvar turma. Tente novamente." }));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta turma? Esta ação é irreversível.")) {
      try {
        const res = await fetch(`${apiUrl}/turmas/${id}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido.' }));
          throw new Error(errorData.message || `Erro ${res.status}: Falha ao excluir turma.`);
        }

        alert("Turma excluída com sucesso!");
        fetchTurmas(); // Re-fetch para atualizar a lista
      } catch (err: any) {
        console.error("Erro ao excluir turma:", err);
        alert(err.message || "Erro ao excluir turma. Tente novamente.");
      }
    }
  };

  const handleEdit = (turma: TurmaServ) => {
    setEditingTurma(turma);
    setFormData({
      disciplina: turma.disciplina.id.toString(), // ID da disciplina
      professor: (turma as any).professorId?.toString() || '', // Certifique-se de que a API retorna professorId ou ajuste
      vagasTotais: turma.vagasTotais,
      horario: turma.horario,
    });
    setShowForm(true);
    setFormErrors({}); // Limpa erros ao abrir para edição
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // === Render ===
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="text-purple-600" size={32} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestão de Turmas</h1>
            <p className="text-sm text-gray-600">Gerencie as turmas e disciplinas</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingTurma(null); resetForm(); }} // Limpa o formulário e erros ao clicar em "Adicionar"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center gap-2"
        >
          <Plus size={16} /> Adicionar Turma
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-purple-300 rounded-lg p-6 mb-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {editingTurma ? 'Editar Turma' : 'Nova Turma'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="Disciplina *"
              name="disciplina"
              value={formData.disciplina}
              onChange={handleInputChange}
              options={disciplinas.map(d => ({ value: d.id.toString(), label: d.nome }))}
              error={formErrors.disciplina} // Passa a mensagem de erro
              disabled={!!editingTurma} // Desabilita em edição
            />
            <SelectInput
              label="Professor *"
              name="professor"
              value={formData.professor}
              onChange={handleInputChange}
              options={professores.map(p => ({ value: p.id.toString(), label: p.nome }))}
              error={formErrors.professor} // Passa a mensagem de erro
              disabled={!!editingTurma} // Desabilita em edição
            />
            <TextInput
              label="Vagas Totais *"
              name="vagasTotais"
              type="number"
              value={formData.vagasTotais}
              onChange={handleInputChange}
              error={formErrors.vagasTotais} // Passa a mensagem de erro
              min="1" // Mínimo de vagas
            />
            <TextInput
              label="Horário *"
              name="horario"
              value={formData.horario}
              onChange={handleInputChange}
              placeholder="Ex: 08:00 - 10:00"
              error={formErrors.horario} // Passa a mensagem de erro
            />
            {formErrors.submit && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                {formErrors.submit}
              </div>
            )}
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                {editingTurma ? "Atualizar" : "Adicionar"}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Lista de Turmas ({turmas.length})
        </h2>

        {turmas.length === 0 ? (
          <p className="text-center text-gray-600 py-8">Nenhuma turma cadastrada ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turmas.map(turma => (
              <div key={turma.id} className="bg-white border-2 border-purple-200 rounded-lg p-4 shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold">TURMA {turma.codigo} - {turma.disciplina.nome}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(turma)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Editar Turma"
                    >
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(turma.id)} className="text-red-500 hover:text-red-700 p-1" title="Excluir Turma">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div><Clock className="inline mr-1 text-gray-500" size={16} /> {turma.horario}</div>
                  <div className="text-xs text-gray-600">Professor: {turma.professor}</div>
                  <div className="text-xs text-gray-600">Vagas: {turma.vagasTotais}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// === Componentes auxiliares atualizados para exibir erros ===
const SelectInput = ({
  label, name, value, onChange, options, error, disabled = false
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Altera para evento completo
  options: { value: string, label: string }[];
  error?: string; // NOVO: Prop para mensagem de erro
  disabled?: boolean; // NOVO: Prop para desabilitar
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      required
      disabled={disabled}
    >
      <option value="">Selecione</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const TextInput = ({
  label, name, type = 'text', value, onChange, placeholder, error, min, disabled = false
}: {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Altera para evento completo
  placeholder?: string;
  error?: string; // NOVO: Prop para mensagem de erro
  min?: string; // NOVO: Prop para atributo min em number inputs
  disabled?: boolean; // NOVO: Prop para desabilitar
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border-2 rounded focus:border-purple-500 ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      required
      min={min} // Passa o atributo min
      disabled={disabled}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Turmas;