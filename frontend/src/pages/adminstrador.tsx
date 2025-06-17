import React, { useState, useEffect } from "react";
import "../styles/adm.css";
import "../styles/aluno.css";
import "../styles/turmas.css"

import FormPeriodo from "./componetes_adm/formPeriodoLetivo";
import FormAluno from "./componetes_adm/formAluno";
import Comunicados from "./componetes_adm/comunicados";
import FormDisciplina from "./componetes_adm/formDisciplina";
import FormProfessor from "./componetes_adm/formProfessor";
import FormCursos from "./componetes_adm/formCurso";

export default function Administrador() {

  const [mostrarFormPeriodo, setMostrarFormPeriodo] = useState(false);
  const [painelTurmaAtivo,setpainelTurmaAtivo] =  useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [comunicados, setComunicados] = useState<{ titulo: string; mensagem: string }[]>([]);
  const [qtdAlunos, setQtdAlunos] = useState(0);
  const [qtdProfessor, setQtdProfessores] = useState(0);

  const [painelAtivo, setPainelAtivo] = useState<string | null>(null);

  // 🔗 Carregar alunos
  useEffect(() => {
    fetch("http://localhost:3000/alunos")
      .then(res => res.json())
      .then(data => setQtdAlunos(data.length))

      .catch(err => console.error("Erro ao carregar dados dos alunos:", err));
  }, []);
  useEffect(() => {
  fetch("http://localhost:3000/professores")
    .then(res => res.json())
    .then(data => setQtdProfessores(data.length))
    .catch(err => console.error("Erro ao carregar dados dos professores:", err));
}, []);

  // 🔗 Carregar comunicados
  useEffect(() => {
    fetch("http://localhost:3000/comunicados")
      .then(res => res.json())
      .then(data => setComunicados(data))
      .catch(err => console.error("Erro ao carregar comunicados:", err));
  }, []);

  // 📬 Enviar comunicado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !mensagem.trim()) return;

    try {
      const response = await fetch("http://localhost:3000/comunicados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, mensagem }),
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      setComunicados(prev => [...prev, { titulo, mensagem }]);
      setTitulo("");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar comunicado:", error);
    }
  };
  const abrirPainel = (painel: string) => {
  setPainelAtivo((prev) => (prev === painel ? null : painel));
};

  // 🎯 Toggle funções
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);


  // 🔘 Ações do painel
  const acoes = [
    { label: "Criar postagem", painel: "comunicado" },
    { label: "Criar aluno", painel: "aluno" },
    { label: "Criar professor", painel: "professor" },
    { label: "Criar disciplina", painel: "disciplina" },
    { label: "Criar turma", painel: "turma" },
    { label: "Criar curso", painel: "curso" },
    { label: "Definir Periodo", painel: "periodo"}
  ];

  return (
    <div className="container">
       {painelAtivo && (
        <div className="overlay">
          <div className="dashboard">
          <div className="dashboardHeader">
             <button onClick={() => setPainelAtivo(null)}>Fechar</button>
          </div>
         
            {painelAtivo === "comunicado" && (
              <>
                <h2>Criar nova postagem</h2>
                <form className="formPostagem" onSubmit={handleSubmit}>
                  <label htmlFor="titulo">Título:</label>
                  <input
                    type="text"
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Digite o título"
                  />
                  <label htmlFor="mensagem">Mensagem:</label>
                  <textarea
                    id="mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Digite a mensagem"
                  />
                  <button type="submit">Enviar</button>
                </form>
              </>
            )}
            {painelAtivo === "aluno" && <FormAluno />}
            {painelAtivo === "professor" && <FormProfessor />}
            {painelAtivo === "disciplina" && <FormDisciplina />}
            {painelAtivo === "curso" && <FormCursos></FormCursos>}
            {painelAtivo === "periodo" && <FormPeriodo/>}

          </div>
        </div>
        )}
        {painelAtivo === "turma" && (
        <div className="overlay">
          <div className="dashBoardTurma">
          <div className="dashboardHeader">
             <button onClick={() => setPainelAtivo(null)}>Fechar</button>
          </div>
             <div><h2>Criar turma</h2></div>
          </div>
        </div>
        )}

      {/* 🧭 Sidebar */}
      <aside className="sidebar">
        <div className="user-info">
          <div className="avatar"></div>
          <button className="username-btn" onClick={toggleDropdown}>
            ADMINISTRADOR
          </button>
        </div>

        {dropdownOpen && (
          <div className="dropdown-expanded">
            <button>Conta</button>
            <button>Configurações</button>
          </div>
        )}

        <nav className="nav-links">
          <button>Professores matriculados</button>
          <button>Alunos</button>
          <button>Disciplinas</button>
          <button>Turmas</button>
        </nav>

        <div className="logout">
          <button>Sair</button>
        </div>
      </aside>

      {/* 🖥️ Conteúdo Principal */}
      <main className="content">
        {/* 🔢 Cards */}
        <div className="dashboard-cards">
          <div className="card">
            <h4>Alunos Cadastrados</h4>
            <p>{qtdAlunos}</p>
          </div>
          <div className="card">
            <h4>Professores Cadastrados</h4>
            <p>{qtdProfessor}</p>
          </div>
          <div className="card">
            <h4>Total de Turmas</h4>
            <p>0</p>
          </div>
          <div className="card">
            <h4>Alunos Matriculados</h4>
            <p>0%</p>
          </div>
        </div>

        {/* 🎯 Painel */}
        <div className="parent">
          {/* 📢 Comunicados */}
          <div className="div2">
            <div className="direita">
              <h3>Comunicados</h3>
              <Comunicados comunicados={comunicados} setComunicados={setComunicados} />
            </div>
          </div>

          {/* 🎛️ Ações */}
          <div className="div1">
            <div className="esquerda">
              <h1>Ações</h1>
              <div className="acoes">
                  {acoes.map((acao, index) => (
                    <button
                      key={index}
                      className="botaoDashboard"
                      onClick={() => abrirPainel(acao.painel)}
                    >
                      {painelAtivo === acao.painel ? "Fechar painel" : acao.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Formulários */}
          <div className="div3">
           
          </div>

          {/* 🗓️ Período Letivo */}
          <div className="div4">
            
            
          </div>
        </div>
      </main>
    </div>
  );
}
