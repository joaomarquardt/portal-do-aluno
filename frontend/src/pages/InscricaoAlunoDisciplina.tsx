import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "@/contexts/AuthContext";

interface TurmaServ {
  id: number;
  codigo: string;
  horario: string;
  periodo: string;
  vagasTotais: number;
  status: string;
  professor: string;
  disciplina: Disciplina;
}
interface Disciplina {
  id: number;
  codigo: string;
  nome: string;
  periodo: number;
  cargaHoraria: number;
}


const periodoAluno = 4;
const apiUrl = import.meta.env.VITE_URL_API;
export default function InscricaoAlunoDisciplina() {
  const {user} = useAuth()
  const [turmaSelecionada, setTurmaSelecionada] = useState<TurmaServ | null>(null);
  const [turmas, setTurmas] = useState<TurmaServ[]>([]);
  const [filtro, setFiltro] = useState("");
  const [periodosAbertos, setPeriodosAbertos] = useState<{ [periodo: number]: boolean }>({});

  const togglePeriodo = (periodo: number) => {
    setPeriodosAbertos((prev) => ({
      ...prev,
      [periodo]: !prev[periodo],
    }));
  };

  const turmasFiltradas = turmas.filter((turma) =>
    turma.disciplina.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const turmasAgrupadas = turmas.reduce((acc: Record<number, TurmaServ[]>, turma) => {
    if (!acc[turma.disciplina.periodo]) acc[turma.disciplina.periodo] = [];
    acc[turma.disciplina.periodo].push(turma);
    return acc;
  }, {});


const fetchTurmas = useCallback(async () => {
    try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("Token de autenticação não encontrado.");

    const res = await axios.get(`${apiUrl}/turmas`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const turmasTratadas = res.data.map((turma: any) => ({
        ...turma,
        professor: turma.professor?.nome || 'Desconhecido'
    }));
    setTurmas(turmasTratadas);
    } catch (err) {
    console.error('Erro ao buscar turmas:', err);
    }
}, [apiUrl]);

useEffect(()=>{
    fetchTurmas()
   
},[fetchTurmas])

const handleInscrever = async (turmaId: number) => {
    console.log(turmaId)
    if (!user?.idUsuario) {
        alert("Usuário não autenticado.");
        return;
    }
    try {
        const response = await fetch(`${apiUrl}/turmas/${turmaId}/alunos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ idAlunos: [user.idAluno] })
        });
        if (!response.ok) {
        const erro = await response.json();
        alert(`Erro ao se inscrever: ${erro?.mensagem || "erro desconhecido"}`);
        return;
        }

        alert("Inscrição realizada com sucesso!");


    } catch (err) {
        console.error("Erro ao se inscrever:", err);
        alert("Erro de conexão ao tentar se inscrever.");
    }
};

return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-[100rem] h-[85vh] mx-auto bg-white rounded-2xl shadow-lg grid grid-cols-2 gap-10 p-10">
        {/* Lista de Turmas */}
        <div className="overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Turmas Disponíveis</h2>

          <input
            type="text"
            placeholder="Buscar por nome da turma..."
            className="w-full mb-6 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

            <ul className="space-y-4">
            {filtro ? (
                turmasFiltradas.length > 0 ? (
                turmasFiltradas.map((turma) => (
                    <li
                    key={turma.id}
                    onClick={() => setTurmaSelecionada(turma)}
                    className="cursor-pointer p-5 border border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition shadow-sm bg-white"
                    >
                    <p className="font-semibold text-lg text-gray-800">{turma.disciplina.nome}</p>
                    <p className="text-sm text-gray-600">Código: {turma.codigo}</p>
                    <p className="text-sm text-gray-600">Período mínimo: {turma.disciplina.periodo}</p>
                    </li>
                ))
                ) : (
                <p className="text-gray-500 italic">Nenhuma turma encontrada.</p>
                )
            ) : (
                Object.keys(turmasAgrupadas)
                .sort((a, b) => Number(a) - Number(b))
                .filter((periodo) => Number(periodo) >= 2) 
                .map((periodo) => (
                    <div key={periodo} className="border border-gray-300 rounded-xl bg-gray-50">
                    <button
                        onClick={() => togglePeriodo(Number(periodo))}
                        className="w-full text-left px-4 py-3 font-semibold text-gray-800 hover:bg-gray-200 transition rounded-t-xl"
                    >
                        {periodo}º Período
                    </button>
                    {periodosAbertos[Number(periodo)] && (
                        <ul className="px-4 pb-4 space-y-2">
                        {turmasAgrupadas[Number(periodo)].map((turma) =>
                            turma.status === 'ATIVA' && turma.disciplina.periodo >= 2 ? (
                            <li
                                key={turma.id}
                                onClick={() => setTurmaSelecionada(turma)}
                                className="cursor-pointer p-4 border border-gray-300 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition shadow-sm bg-white"
                            >
                                <p className="font-semibold text-gray-800">{turma.disciplina.nome}</p>
                                <p className="text-sm text-gray-600">Código: {turma.codigo}</p>
                            </li>
                            ) : null
                        )}
                        </ul>
                    )}
                    </div>
                ))
            )}
            </ul>

        </div>

        {/* Detalhes da Turma Selecionada */}
        <div className="overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Detalhes da Turma</h2>

          {turmaSelecionada ? (
            <div className="space-y-3 p-6 border border-gray-300 rounded-2xl bg-gray-50 shadow-sm">
              <p><strong className="text-gray-700">Nome:</strong> {turmaSelecionada.disciplina.nome} - {turmaSelecionada.codigo} - status: {turmaSelecionada.status}</p>
              <p><strong className="text-gray-700">Código:</strong> {turmaSelecionada.codigo}</p>
              <p><strong className="text-gray-700">Professor:</strong> {turmaSelecionada.professor}</p>
              <p><strong className="text-gray-700">Disciplina:</strong> {turmaSelecionada.disciplina.nome}</p>
              <p><strong className="text-gray-700">Horário:</strong> {turmaSelecionada.horario}</p>
              <p><strong className="text-gray-700">Período mínimo:</strong> {turmaSelecionada.disciplina.periodo}</p>
              <p><strong className="text-gray-700">Vagas totais:</strong> {turmaSelecionada.vagasTotais}</p>

              <button
                className={`mt-6 px-6 py-3 rounded-xl font-medium text-white transition ${
                  periodoAluno >= Number(turmaSelecionada.disciplina.periodo)
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={periodoAluno < Number(turmaSelecionada.disciplina.periodo)}
                onClick={()=>{handleInscrever(turmaSelecionada.id)}}
              >
                {periodoAluno >= Number(turmaSelecionada.disciplina.periodo)
                  ? "Inscrever-se"
                  : "Indisponível (período insuficiente)"}
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic mt-12">Selecione uma turma à esquerda para ver os detalhes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
