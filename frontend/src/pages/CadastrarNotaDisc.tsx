// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Calendar, UserCheck } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// interface TurmasData {
//   id: number;
//   cpf: string;
//   nome: string;
//   emailPessoal: string;
//   emailInstitucional: string;
//   telefone: string;
//   matricula: string;
//   periodoAtual: number;
//   periodoIngresso: string;
// }

// const UserProfileEditForm = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const idAluno = user?.idAluno;

//   const [formData, setFormData] = useState<TurmasData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const apiUrl = import.meta.env.VITE_URL_API;

// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         const token = localStorage.getItem('token');
// //         if (!token) {
// //           throw new Error('Token de autenticação não encontrado.');
// //         }
// //         const targetId = user?.idAluno;

// //         const response = await axios.get<TurmasData>(`${apiUrl}/alunos/${targetId}`, {
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //           },
// //         });

// //         setFormData(response.data);
// //       } catch (err) {
// //         console.error('Erro ao buscar dados do perfil:', err);
// //         if (axios.isAxiosError(err)) {
// //           setError(err.response?.data?.message || 'Erro ao carregar perfil.');
// //         } else {
// //           setError('Ocorreu um erro inesperado ao carregar seu perfil.');
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (user) {
// //       fetchProfile();
// //     } else {
// //       setLoading(false);
// //       setError("Usuário não autenticado.");
// //     }
// //   }, [idAluno, user, apiUrl]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => (prev ? { ...prev, [name]: value } : null));
// //   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData) return;

//     setSaving(true);
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Token de autenticação não encontrado.');
//       }

//       const targetId = user?.idAluno;

//       await axios.put(`${apiUrl}/alunos/${targetId}`, formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       setSuccessMessage('Perfil atualizado com sucesso!');
//       setTimeout(() => navigate('/dashboard/aluno'), 2000);

//     } catch (err) {
//       console.error('Erro ao atualizar perfil:', err);
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.message || 'Erro ao atualizar perfil.');
//       } else {
//         setError('Ocorreu um erro inesperado ao atualizar seu perfil.');
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //         <p className="text-gray-700 text-lg">Carregando perfil...</p>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-700 p-4">
// //         <p className="text-lg font-semibold mb-4">Erro:</p>
// //         <p className="mb-4">{error}</p>
// //         <button
// //           onClick={() => navigate('/dashboard/aluno')}
// //           className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
// //         >
// //           <ChevronLeft size={16} /> Voltar ao Dashboard
// //         </button>
// //       </div>
// //     );
// //   }

// //   if (!formData) {
// //     return (
// //         <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //             <p className="text-gray-700 text-lg">Perfil não encontrado.</p>
// //         </div>
// //     );
// //   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
//           <button
//             onClick={() => navigate('/dashboard/aluno')}
//             className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-2"
//           >
//             <ChevronLeft size={16} /> Voltar
//           </button>
//         </div>

//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
//             <div className="flex items-center gap-2 text-gray-700 mb-3">
//                 <UserCheck size={20} className="text-blue-600" />
//                 <h3 className="text-lg font-semibold">Informações da Matrícula</h3>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <p className="text-sm font-medium text-gray-600">Período Atual:</p>
//                     <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
//                         <Calendar size={18} /> asda
//                     </p>
//                 </div>
//                 <div>
//                     <p className="text-sm font-medium text-gray-600">Período de Ingresso:</p>
//                     <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
//                         <Calendar size={18} /> {formData.periodoIngresso || 'N/A'}
//                     </p>
//                 </div>
//                 <div>
//                     <p className="text-sm font-medium text-gray-600">Matrícula:</p>
//                     <p className="text-lg font-bold text-gray-800">
//                         {formData.matricula || 'N/A'}
//                     </p>
//                 </div>
//             </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
//             <input
//               type="text"
//               id="nome"
//               name="nome"
//               value={formData.nome}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
//             <input
//               type="text"
//               id="cpf"
//               name="cpf"
//               value={formData.cpf}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">Matricula</label>
//             <input
//               type="text"
//               id="matricula"
//               name="matricula"
//               value={formData.matricula}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.emailPessoal}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="emailInstitucional" className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
//             <input
//               type="email"
//               id="emailInstitucional"
//               name="emailInstitucional"
//               value={formData.emailInstitucional}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
//             <input
//               type="tel"
//               id="telefone"
//               name="telefone"
//               value={formData.telefone}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           {error && <p className="text-red-600 text-sm">{error}</p>}
//           {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

//           <button
//             type="submit"
//             disabled={saving}
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             {saving ? 'Salvando...' : (<><Save size={16} /> Salvar Alterações</>)}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserProfileEditForm;










//segunda versão abaixo




// import { ChevronLeft, Save, Calendar, UserCheck } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const UserProfileEditForm = () => {
//   const navigate = useNavigate();

//   // Dados estáticos simulados
//   const formData = {
//     nome: 'João da Silva',
//     cpf: '123.456.789-00',
//     matricula: '202100123456',
//     periodoAtual: 3,
//     periodoIngresso: '2021.1',
//     emailPessoal: 'joao@gmail.com',
//     emailInstitucional: 'joao@unirio.edu.br',
//     telefone: '(21) 99999-9999'
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
//           <button
//             onClick={() => navigate('/dashboard/aluno')}
//             className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-2"
//           >
//             <ChevronLeft size={16} /> Voltar
//           </button>
//         </div>

//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
//           <div className="flex items-center gap-2 text-gray-700 mb-3">
//             <UserCheck size={20} className="text-blue-600" />
//             <h3 className="text-lg font-semibold">Informações da Matrícula</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Período Atual:</p>
//               <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
//                 <Calendar size={18} /> {formData.periodoAtual}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Período de Ingresso:</p>
//               <p className="text-lg font-bold text-gray-800 flex items-center gap-1">
//                 <Calendar size={18} /> {formData.periodoIngresso}
//               </p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Matrícula:</p>
//               <p className="text-lg font-bold text-gray-800">
//                 {formData.matricula}
//               </p>
//             </div>
//           </div>
//         </div>

//         <form className="space-y-4">
//           <div>
//             <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
//             <input
//               type="text"
//               id="nome"
//               value={formData.nome}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
//             <input
//               type="text"
//               id="cpf"
//               value={formData.cpf}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
//             <input
//               type="text"
//               id="matricula"
//               value={formData.matricula}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Pessoal</label>
//             <input
//               type="email"
//               id="email"
//               value={formData.emailPessoal}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="emailInstitucional" className="block text-sm font-medium text-gray-700 mb-1">Email Institucional</label>
//             <input
//               type="email"
//               id="emailInstitucional"
//               value={formData.emailInstitucional}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>
//           <div>
//             <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
//             <input
//               type="tel"
//               id="telefone"
//               value={formData.telefone}
//               className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
//               disabled
//             />
//           </div>

//           <button
//             type="submit"
//             disabled
//             className="w-full bg-blue-400 text-white py-2 px-4 rounded opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             <Save size={16} /> Salvar Alterações
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserProfileEditForm;

import { useState } from 'react';
import { ChevronDown, ChevronUp, Save } from 'lucide-react';

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
}

interface Turma {
  id: number;
  nome: string;
  alunos: Aluno[];
}

const turmasMock: Turma[] = [
  {
    id: 1,
    nome: 'Turma A - Matemática',
    alunos: [
      { id: 101, nome: 'Ana Souza', matricula: '202100111' },
      { id: 102, nome: 'Carlos Lima', matricula: '202100222' },
    ],
  },
  {
    id: 2,
    nome: 'Turma B - Física',
    alunos: [
      { id: 201, nome: 'Mariana Torres', matricula: '202100333' },
      { id: 202, nome: 'Lucas Mendes', matricula: '202100444' },
    ],
  },
];

const UserProfileEditForm = () => {
  const [expandedTurmas, setExpandedTurmas] = useState<number[]>([]);
  const [notas, setNotas] = useState<Record<number, { media: string; horas: string }>>({});

  const toggleTurma = (id: number) => {
    setExpandedTurmas((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleInputChange = (
    alunoId: number,
    field: 'media' | 'horas',
    value: string
  ) => {
    setNotas((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        [field]: value,
      },
    }));
  };

  const handleSalvarTurma = (turma: Turma) => {
    const dados = turma.alunos.map((aluno) => ({
      alunoId: aluno.id,
      nome: aluno.nome,
      matricula: aluno.matricula,
      media: notas[aluno.id]?.media || '',
      horas: notas[aluno.id]?.horas || '',
    }));

    console.log(`Notas salvas para ${turma.nome}:`, dados);
    alert(`Notas da ${turma.nome} salvas com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Lançar Notas e Carga Horária</h2>

        <div className="space-y-6">
          {turmasMock.map((turma) => (
            <div key={turma.id} className="border border-gray-300 rounded-lg shadow-sm">
              <button
                type="button"
                onClick={() => toggleTurma(turma.id)}
                className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-t-lg"
              >
                <span className="text-lg font-semibold text-gray-700">{turma.nome}</span>
                {expandedTurmas.includes(turma.id) ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {expandedTurmas.includes(turma.id) && (
                <div className="p-4 space-y-4 bg-white">
                  {turma.alunos.map((aluno) => (
                    <div
                      key={aluno.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4"
                    >
                      <div className="flex-1 text-gray-700">
                        <p className="font-semibold">{aluno.nome}</p>
                        <p className="text-sm text-gray-500">Matrícula: {aluno.matricula}</p>
                      </div>

                      <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex flex-col">
                          <label htmlFor={`media-${aluno.id}`} className="text-sm text-gray-600">
                            Média Final
                          </label>
                          <input
                            type="number"
                            id={`media-${aluno.id}`}
                            value={notas[aluno.id]?.media || ''}
                            onChange={(e) =>
                              handleInputChange(aluno.id, 'media', e.target.value)
                            }
                            className="px-3 py-2 border border-gray-300 rounded w-32"
                            step="0.1"
                            min="0"
                            max="10"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor={`horas-${aluno.id}`} className="text-sm text-gray-600">
                            Carga Horária
                          </label>
                          <input
                            type="number"
                            id={`horas-${aluno.id}`}
                            value={notas[aluno.id]?.horas || ''}
                            onChange={(e) =>
                              handleInputChange(aluno.id, 'horas', e.target.value)
                            }
                            className="px-3 py-2 border border-gray-300 rounded w-32"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => handleSalvarTurma(turma)}
                      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Save size={18} /> Salvar Turma
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditForm;

