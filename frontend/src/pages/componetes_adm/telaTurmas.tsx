import React, { useEffect, useState } from "react";
import "../../styles/turmas.css";

type Professor = {
  professor:{
    id:string;
    siape:string;
    };
  nome: string;
  emailInstitucional: string;
};

type Disciplina = {
  id: string;
  codigo: string;
  nome: string;
  periodo: string;
  vagasTotais: string;
  cargaHoraria: string;
};

export default function TelaTurmas() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [professorPorDisciplina, setProfessorPorDisciplina] = useState<{ [disciplinaId: string]: string }>({});
  const [horarioPorDisciplina, setHorarioPorDisciplina] = useState<{ [disciplinaId: string]: string }>({});

  useEffect(() => {
    fetch("http://localhost:3000/professores")
      .then(res => res.json())
      .then(data => setProfessores(data))
      .catch(err => console.error("Erro ao carregar professores:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/disciplina")
      .then(res => res.json())
      .then(data => setDisciplinas(data))
      .catch(err => console.error("Erro ao carregar disciplinas:", err));
  }, []);

  const handleSelecionarProfessor = (disciplinaId: string, professorId: string) => {
    setProfessorPorDisciplina(prev => ({
      ...prev,
      [disciplinaId]: professorId
    }));
  };

  const handleHorarioChange = (disciplinaId: string, horario: string) => {
    setHorarioPorDisciplina(prev => ({
      ...prev,
      [disciplinaId]: horario
    }));
  };

  const handleCriarTurma = (disciplina: Disciplina) => {
    const professorId = professorPorDisciplina[disciplina.id];
    const horario = horarioPorDisciplina[disciplina.id];

    if (!professorId) {
      alert("Selecione um professor para essa disciplina.");
      return;
    }

    if (!horario || horario.trim() === "") {
      alert("Informe um horário para essa turma.");
      return;
    }

    const payload = {
      disciplinaID: disciplina.id,
      professorID: professorId,
      horario: horario
    };

    console.log("Enviando dados:", payload);

    fetch("http://localhost:3000/turmas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) {
          alert("Turma criada com sucesso!");
        } else {
          alert("Erro ao criar turma.");
        }
      })
      .catch(err => console.error("Erro:", err));
  };

  return (
    <section className="containerTurma">
      <h2>Cadastro de Turmas</h2>
      <div className="disciplinasContainer">
        {disciplinas.map((disciplina) => (
          <div className="disciplinaCard" key={disciplina.id}>
            <h3>{disciplina.nome}</h3>
            <p><strong>Código:</strong> {disciplina.codigo}</p>
            <p><strong>Período:</strong> {disciplina.periodo}</p>
            <p><strong>Vagas:</strong> {disciplina.vagasTotais}</p>
            <p><strong>Carga Horária:</strong> {disciplina.cargaHoraria}h</p>

            <label>Professor:</label>
            <select
              value={professorPorDisciplina[disciplina.id] || ""}
              onChange={(e) => handleSelecionarProfessor(disciplina.id, e.target.value)}
            >
              <option value="">Selecione um professor</option>
              {professores.map((prof) => (
                <option key={prof.professor.id} value={prof.professor.id}>
                  {prof.nome} - ID: {prof.professor.id}
                </option>
              ))}
            </select>

            <label>Horário:</label>
            <input
              type="text"
              placeholder="Ex.: Segunda 10:00-12:00"
              value={horarioPorDisciplina[disciplina.id] || ""}
              onChange={(e) => handleHorarioChange(disciplina.id, e.target.value)}
            />

            <button onClick={() => handleCriarTurma(disciplina)}>
              Criar Turma
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
