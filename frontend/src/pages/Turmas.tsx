import { useEffect, useState } from 'react';
import { BookOpen, Clock, Plus, Trash2 } from "lucide-react";

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
  professor: string;
  disciplina: Disciplina;
}

interface Professor {
  id: number;
  nome: string;
}

const apiUrl = import.meta.env.VITE_URL_API;

const Turmas = () => {
  const [turmas, setTurmas] = useState<TurmaServ[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTurma, setEditingTurma] = useState<TurmaServ | null>(null);

  const [formData, setFormData] = useState({
    disciplina: '',
    professor: '',
    vagasTotais: 0,
    horario: '',
  });

  const fetchProfessores = async () => {
    try {
      const res = await fetch(`${apiUrl}/professores/select`, {
        headers: authHeaders()
      });
      const data = await res.json();
      setProfessores(data);
    } catch (err) {
      console.error("Erro ao buscar professores:", err);
    }
  };

  const fetchDisciplinas = async () => {
    try {
      const res = await fetch(`${apiUrl}/disciplinas`, {
        headers: authHeaders()
      });
      const data = await res.json();
      setDisciplinas(data);
    } catch (err) {
      console.error("Erro ao buscar disciplinas:", err);
    }
  };

  const fetchTurmas = async () => {
    try {
      const res = await fetch(`${apiUrl}/turmas`, {
        headers: authHeaders()
      });
      const data = await res.json();
      const formatadas = data.map((turma: any) => ({
        ...turma,
        professor: turma.professor?.nome || 'Desconhecido',
      }));
      setTurmas(formatadas);
    } catch (err) {
      console.error("Erro ao buscar turmas:", err);
    }
  };

  const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    fetchProfessores();
    fetchDisciplinas();
    fetchTurmas();
  }, []);

  const resetForm = () => {
    setFormData({ disciplina: '', professor: '', vagasTotais: 0, horario: '' });
    setEditingTurma(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const disciplinaID = Number(formData.disciplina);
    const professorID = Number(formData.professor);
    const dto = {
      disciplinaID,
      professorID,
      vagasTotais: formData.vagasTotais,
      horario: formData.horario,
    };

    try {
      const res = await fetch(`${apiUrl}/turmas`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(dto),
      });

      if (!res.ok) throw new Error("Erro ao criar turma.");

      const novaTurma = await res.json();
      setTurmas([...turmas, novaTurma]);
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar turma:", err);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta turma?")) {
      setTurmas(turmas.filter(t => t.id !== id));
    }
  };

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
          onClick={() => setShowForm(true)}
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
              label="Disciplina"
              value={formData.disciplina}
              onChange={val => setFormData({ ...formData, disciplina: val })}
              options={disciplinas.map(d => ({ value: d.id.toString(), label: d.nome }))}
            />
            <SelectInput
              label="Professor"
              value={formData.professor}
              onChange={val => setFormData({ ...formData, professor: val })}
              options={professores.map(p => ({ value: p.id.toString(), label: p.nome }))}
            />
            <TextInput
              label="Vagas Totais"
              type="number"
              value={formData.vagasTotais}
              onChange={val => setFormData({ ...formData, vagasTotais: parseInt(val) || 0 })}
            />
            <TextInput
              label="Horário"
              value={formData.horario}
              onChange={val => setFormData({ ...formData, horario: val })}
              placeholder="Ex: 08:00 - 10:00"
            />
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
                  <button onClick={() => handleDelete(turma.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <div><Clock className="inline mr-1 text-gray-500" size={16} /> {turma.horario}</div>
                  <div className="text-xs text-gray-600">Professor: {turma.professor}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SelectInput = ({
  label, value, onChange, options
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string, label: string }[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
      required
    >
      <option value="">Selecione</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const TextInput = ({
  label, type = 'text', value, onChange, placeholder
}: {
  label: string;
  type?: string;
  value: any;
  onChange: (val: string) => void;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-purple-500"
      required
    />
  </div>
);

export default Turmas;
