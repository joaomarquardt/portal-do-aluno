import { useEffect, useState, useCallback } from 'react';
import { Users, MessageSquarePlus, X, ChevronLeft, ChevronRight } from 'lucide-react'; // Remove ChevronsRight se não for usar um botão só pra ele
import AlunoCard from '../components/AlunoCard';
import AddAlunoForm from '../components/AddAlunoForm';
import Stats from '../components/Stats';

interface Aluno {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  emailInstitucional: string;
  telefone: string;
  CursoId: number;
}

interface Comunicado {
  id: number;
  titulo: string;
  mensagem: string;
  dataPublicacao: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

const apiUrl = import.meta.env.VITE_URL_API;

const Index = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComunicadoForm, setShowComunicadoForm] = useState(false);
  const [comunicadoForm, setComunicadoForm] = useState({ titulo: '', mensagem: '' });
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [crMedio, setCrMedio] = useState<number | null>(null);
  const [numAlunosAltoDesempenho, setNumAlunosAltoDesempenho] = useState(0);
  const [periodoMaisComum, setPeriodoMaisComum] = useState(0);
  const [errorDashboard, setErrorDashboard] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);

  const goToPage = useCallback((pageNumber: number) => {
    const newPage = Math.max(0, Math.min(pageNumber, totalPages > 0 ? totalPages - 1 : 0));
    setCurrentPage(newPage);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const fetchAlunos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        ...(searchTerm && { nome: searchTerm })
      }).toString();

      const response = await fetch(`${apiUrl}/alunos/paginacao?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar alunos: ${response.status}`);
      }

      const data: PaginatedResponse<Aluno> = await response.json();
      setAlunos(data.content);
      setTotalPages(data.totalPages);

      if (data.totalPages > 0 && currentPage >= data.totalPages) {
        setCurrentPage(data.totalPages - 1);
      } else if (data.totalPages === 0 && currentPage !== 0) {
        setCurrentPage(0);
      }

    } catch (error) {
      console.error('Falha ao buscar alunos:', error);
    }
  }, [currentPage, pageSize, searchTerm]);

  const fetchDashboardData = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/turmas/sumario-dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
      throw new Error(`Erro ao buscar dados do dashboard: ${response.status} - ${errorData.message || 'Erro desconhecido.'}`);
    }

    const data = await response.json();
    setTotalAlunos(data.totalAlunos);
    setCrMedio(data.crMedio);
    setNumAlunosAltoDesempenho(data.numAlunosAltoDesempenho);
    setPeriodoMaisComum(data.periodoMaisComum);
    setErrorDashboard(null);
  } catch (err: any) {
    console.error('Erro ao buscar dados do dashboard:', err);
    if (err instanceof Error && err.message.startsWith('Erro ao buscar dados do dashboard:')) {
      setErrorDashboard(err.message);
    }
    else if (err instanceof TypeError && err.message === 'Failed to fetch') {
      setErrorDashboard("Erro de rede: Não foi possível conectar ao servidor. Verifique sua conexão ou o servidor.");
    }
    else {
      setErrorDashboard('Um erro inesperado ocorreu: ' + (err.message || 'Erro desconhecido.'));
    }
  }
}, []);

  const fetchComunicados = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/comunicados`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar comunicados: ${response.status}`);
      }

      const data: Comunicado[] = await response.json();
      setComunicados(data);
    } catch (error) {
      console.error('Falha ao buscar comunicados:', error);
    }
  }, []);

  useEffect(() => {
    fetchAlunos();
    fetchComunicados();
    fetchDashboardData();
  }, [fetchAlunos, fetchComunicados, fetchDashboardData]);

  const addAluno = async (data: Omit<Aluno, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/alunos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar aluno: ${response.status}`);
      }

      await response.json();
      alert('Aluno adicionado com sucesso!');
      fetchAlunos();
    } catch (error) {
      console.error('Falha ao adicionar aluno:', error);
      alert('Erro ao adicionar aluno. Tente novamente.');
    }
  };

  const updateAluno = async (updated: Aluno) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/alunos/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar aluno: ${response.status}`);
      }

      await response.json();
      alert('Aluno atualizado com sucesso!');
      setEditingAluno(null);
      fetchAlunos();
    } catch (error) {
      console.error('Falha ao atualizar aluno:', error);
      alert('Erro ao atualizar aluno. Tente novamente.');
    }
  };

  const deleteAluno = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/alunos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao excluir aluno: ${response.status}`);
        }

        alert('Aluno excluído com sucesso!');
        fetchAlunos();
      } catch (error) {
        console.error('Falha ao excluir aluno:', error);
        alert('Erro ao excluir aluno. Tente novamente.');
      }
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleComunicadoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoComunicado = {
      titulo: comunicadoForm.titulo,
      mensagem: comunicadoForm.mensagem,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/comunicados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(novoComunicado),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar comunicado: ${response.status}`);
      }

      await response.json();
      setComunicadoForm({ titulo: '', mensagem: '' });
      setShowComunicadoForm(false);
      alert('Comunicado criado com sucesso!');
      fetchComunicados();
    } catch (error) {
      console.error('Falha ao criar comunicado:', error);
      alert('Erro ao criar comunicado. Tente novamente.');
    }
  };

  const deleteComunicado = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este comunicado?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/comunicados/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao excluir comunicado: ${response.status}`);
        }

        alert('Comunicado excluído com sucesso!');
        fetchComunicados();
      } catch (error) {
        console.error('Falha ao excluir comunicado:', error);
        alert('Erro ao excluir comunicado. Tente novamente.');
      }
    }
  };

  const getPaginationButtons = () => {
    if (totalPages <= 1) return [];

    const buttons: (number | string)[] = [];
    const maxVisiblePageNumbers = 3;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePageNumbers / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePageNumbers - 1);

    if (endPage === totalPages - 1) {
      startPage = Math.max(0, totalPages - maxVisiblePageNumbers);
    }
    else if (startPage === 0) {
      endPage = Math.min(totalPages - 1, maxVisiblePageNumbers - 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (endPage < totalPages - 1) {
        if (endPage + 1 < totalPages - 1) {
            buttons.push('...');
        }
        buttons.push(totalPages - 1);
    }

    if (startPage > 0 && !buttons.includes(0)) {
        buttons.unshift(0);
        if (startPage > 1) {
            buttons.splice(1, 0, '...');
        }
    }

    return buttons;
  };

  const paginationButtons = getPaginationButtons();

  return (
    <div className="p-6">
      <Stats totalAlunosGlobal={totalAlunos} alunosNaPagina={alunos} crMedio={crMedio} numAlunosAltoDesempenho={numAlunosAltoDesempenho} periodoMaisComum={periodoMaisComum} />

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

        <div className="space-y-3">
          {comunicados.length === 0 ? (
            <p className="text-gray-600 text-center">Nenhum comunicado disponível.</p>
          ) : (
            comunicados.map(({ id, titulo, mensagem, dataPublicacao }) => (
              <div key={id} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{titulo}</h4>
                    <p className="text-gray-600 mt-1">{mensagem}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Administração - {new Date(dataPublicacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button onClick={() => deleteComunicado(id)} className="text-red-500 hover:text-red-700 ml-2">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <AddAlunoForm
        onAddAluno={addAluno}
        editingAluno={editingAluno}
        onUpdateAluno={updateAluno}
        onCancel={() => setEditingAluno(null)}
      />

      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Lista de Alunos ({totalAlunos})
          </h2>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar aluno por nome..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-blue-500"
          />
        </div>

        {alunos.length === 0 && !searchTerm ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum aluno cadastrado ainda.</p>
          </div>
        ) : alunos.length === 0 && searchTerm ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum aluno encontrado para "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alunos.map((aluno) => (
              <AlunoCard
                key={aluno.id}
                aluno={aluno}
                onEdit={handleEdit}
                onDelete={deleteAluno}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {paginationButtons.map((page, index) =>
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <button
                  key={`page-${page}`}
                  onClick={() => goToPage(page as number)}
                  className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {(page as number) + 1} {}
                </button>
              )
            )}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
