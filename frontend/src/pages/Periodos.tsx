
import { useState, useEffect } from 'react';
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";

interface Periodo {
  id: number;
  nome: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

const Periodos = () => {
  const [periodos, setPeriodos] = useState<Periodo[]>([
  ]);

  const [editingPeriodo, setEditingPeriodo] = useState<Periodo | null>(null);
  const [year, setYear] = useState<Number>(2025)
  const [period,setPeriod] = useState<Number>(1)
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    ativo: false
  });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (editingPeriodo) {
      // Atualização futura: PUT para editar
      const updatedPeriodo = { ...editingPeriodo, ...formData };
      setPeriodos(prev =>
        prev.map(p => (p.id === editingPeriodo.id ? updatedPeriodo : p))
      );
      setEditingPeriodo(null);
      alert('Período atualizado localmente!');
    } else {
      // Criar novo período via POST
      const response = await fetch("http://localhost:3000/periodo-letivo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ano: year,
          semestre: period,
          ativo: formData.ativo,
          dataInicio: formData.dataInicio,
          dataFim: formData.dataFim
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar período: ${response.status}`);
      }

      const savedPeriodo: Periodo = await response.json();
      setPeriodos(prev => [...prev, savedPeriodo]);

      alert('Período criado com sucesso!');
    }
  } catch (error) {
    console.error("Erro no envio do período:", error);
    alert("Erro ao salvar o período.");
  }

  setFormData({ nome: '', dataInicio: '', dataFim: '', ativo: false });
  setShowForm(false);
};

  const handleEdit = (periodo: Periodo) => {
    setEditingPeriodo(periodo);
    setFormData({
      nome: periodo.nome,
      dataInicio: periodo.dataInicio,
      dataFim: periodo.dataFim,
      ativo: periodo.ativo
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este período?')) {
      setPeriodos(periodos.filter(p => p.id !== id));
      alert('Período excluído com sucesso!');
    }
  };
  const validateName = (name:string) =>{
      const regex = /^\d{4}\.(1|2)$/;
      const test =  regex.test(name);
      if (test){
        setYear(Number.parseInt(name.substring(0,3)))
        setPeriod(Number.parseInt(name[5]))
      }
  }
  const cancelForm = () => {
    setShowForm(false);
    setEditingPeriodo(null);
    setFormData({ nome: '', dataInicio: '', dataFim: '', ativo: false });
  };



  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch("http://localhost:3000/periodo-letivo",{
          headers:{
            "Content-type":"application/json",
            "Authorization":`Bearer ${localStorage.getItem("token")}` 
          }
        });
        const data:Periodo[] = await response.json();
        setPeriodos(data)
      } catch (error) {
        console.error("Erro ao buscar os períodos:", error);
      }
    };

    fetchPeriods();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Gestão de Períodos Letivos
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} />
            {showForm ? 'Cancelar' : 'Novo Período'}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingPeriodo ? 'Editar Período' : 'Novo Período'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Período *
                  </label>
                  <input
                    type="text"
                    value={year +'.'+ period}
                    onChange={(e) => {
                      validateName(e.target.value)
                      setFormData({...formData, nome:e.target.value })
                    }}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
                    placeholder="Ex: 2024.1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim *
                  </label>
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.ativo}
                      onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Período Ativo</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {editingPeriodo ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Períodos */}
        <div className="space-y-3">
          {periodos.map((periodo) => (
            <div key={periodo.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{periodo.nome}</h3>
                    {periodo.ativo && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        ATIVO
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600">
                    <p><strong>Início:</strong> {new Date(periodo.dataInicio).toLocaleDateString('pt-BR')}</p>
                    <p><strong>Fim:</strong> {new Date(periodo.dataFim).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(periodo)}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(periodo.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {periodos.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Nenhum período letivo cadastrado ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Periodos;
