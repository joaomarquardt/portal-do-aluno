import React, { useState, useEffect } from "react";
import "../styles/adm.css";
import "../styles/aluno.css";
import { FaTrash } from "react-icons/fa";

import FormPeriodo from "./componetes_adm/formPeriodoLetivo";
import FormAluno from "./componetes_adm/formAluno";
import Comunicados from "./componetes_adm/comunicados";
import FormProfessor from "./componetes_adm/formProfessor";

export default function Administrador() {
  const [mostrarFormComunicado, setMostrarFormComunicado] = useState(false);
  const [mostrarFormAluno, setMostrarFormAluno] = useState(false);
  const [mostrarFormPeriodo, setMostrarFormPeriodo] = useState(false);
  const [mostrarFormProfessor, setMostrarFormProfessor] = useState(false);
  const [mostrarFormDisciplina, setMostrarFormDisciplina] = useState(false);

  const [mostrarFormCurso, setMostrarFormCurso] = useState(false);
  const [mostrarFormTurma, setMostrarFormTurma] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [comunicados, setComunicados] = useState<{ titulo: string; mensagem: string }[]>([]);
  const [qtdAlunos, setQtdAlunos] = useState(0);

  // 🔗 Carregar alunos
  useEffect(() => {
    fetch("http://localhost:3000/alunos")
      .then(res => res.json())
      .then(data => setQtdAlunos(data.length))
      .catch(err => console.error("Erro ao carregar dados dos alunos:", err));
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

  // 🎯 Toggle funções
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleFormComunicado = () => setMostrarFormComunicado(!mostrarFormComunicado);
  const toggleFormAluno = () => setMostrarFormAluno(!mostrarFormAluno);
  const toggleFormProfessor = () => setMostrarFormProfessor(!mostrarFormProfessor)
  const toggleFormTurma = () => setMostrarFormTurma(!mostrarFormTurma)
  const toggleFormCurso = () => setMostrarFormCurso(!mostrarFormCurso)
  const toggleFormDisciplina = () => setMostrarFormDisciplina(!mostrarFormDisciplina)
  const toggleFormPeriodo = () => setMostrarFormPeriodo(!mostrarFormPeriodo);

  // 🔘 Ações do painel
  const acoes = [
    { label: "Criar postagem", action: toggleFormComunicado, ativo: mostrarFormComunicado },
    { label: "Criar aluno", action: toggleFormAluno, ativo: mostrarFormAluno },
    { label: "Criar professor", action: toggleFormProfessor, ativo: mostrarFormProfessor },
    { label: "Criar disciplina", action: toggleFormDisciplina, ativo: mostrarFormDisciplina },
    { label: "Criar turma", action: toggleFormTurma, ativo: mostrarFormTurma },
    { label: "Criar curso", action: toggleFormCurso, ativo: mostrarFormCurso },
  ];

  return (
    <div className="container">
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
            <p>0</p>
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
                  <button key={index} className="botaoDashboard" onClick={acao.action}>
                    {acao.ativo ? "Fechar painel" : acao.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formulários */}
          <div className="div3">
            {(mostrarFormComunicado || mostrarFormAluno) && (
              <div className="formularioEntre">
                {mostrarFormComunicado && (
                  <div className="dashboard">
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
                  </div>
                )}

                {mostrarFormAluno && (<FormAluno />)}
                {mostrarFormProfessor && (<FormProfessor />)}
              </div>
            )}
          </div>

          {/* 🗓️ Período Letivo */}
          <div className="div4">
            <button onClick={toggleFormPeriodo}>Definir Período Letivo</button>
            {mostrarFormPeriodo && <FormPeriodo />}
          </div>
        </div>
      </main>
    </div>
  );
}
