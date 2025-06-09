import React, { useState, useEffect } from "react";
import "../styles/adm.css";
import { FaTrash } from "react-icons/fa";
import "../styles/aluno.css"


import Comunicados from "./componetes_adm/comunicados";


export default function Administrador() {
  const [mostrarDashboard, setMostrarDashboard] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [comunicados, setComunicados] = useState<{ titulo: string; mensagem: string }[]>([]);

  const [qtdAlunos, setQtdAlunos] = useState(0)

  useEffect(()=>{
    fetch("http://localhost:3000/alunos")
    .then(res =>res.json())
    .then(data => setQtdAlunos(data.length))
    .then(err => console.error("erro ao carregar dados alunos "))
  })
  useEffect(() => {
    fetch("http://localhost:3000/comunicados")
      .then(res => res.json())
      .then(data => setComunicados(data))
      .catch(err => console.error("Erro ao carregar comunicados:", err));
  }, []);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const alternarDashboard = () => {
    setMostrarDashboard(!mostrarDashboard);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (titulo.trim() === "" || mensagem.trim() === "") return;

    try {
      const response = await fetch("http://localhost:3000/comunicados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, mensagem }),
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      setComunicados([...comunicados, { titulo, mensagem }]);
      setTitulo("");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
  };

  return (
   <div className="container">
      <aside className="sidebar">
        <div className="user-info">
          <div className="avatar"></div>
          <button className="username-btn" onClick={toggleDropdown}>
            ADMINSTRADOR
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
      <main className="content">
        <div className="dashboard-cards">
          <div className="card">
            <h4>Alunos Cadastrados</h4>
            <p>234</p>
          </div>
          <div className="card">
            <h4>Professores Cadastrados</h4>
            <p>42</p>
          </div>
          <div className="card">
            <h4>Total de Turmas</h4>
            <p>18</p>
          </div>
          <div className="card">
            <h4>Alunos Matriculados</h4>
            <p>87%</p>
          </div>
        </div> 
      <div className="conteudo">
        
        <div className="esquerda">
          <h1>Ações</h1>
          <div className="acoes">
            <button className="botaoDashboard" onClick={alternarDashboard}>
            {mostrarDashboard ? "Fechar painel" : "Criar postagem"}
          </button>
          <button className="botaoDashboard" onClick={alternarDashboard}>
            Cadastrar Aluno
          </button>
          <button className="botaoDashboard" onClick={alternarDashboard}>
            Cadastrar Professor
          </button>
          </div>
       
          
          
          {mostrarDashboard && (
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
                ></textarea>

                <button type="submit">Enviar</button>
              </form>
            </div>
          )}
        </div>
          
        <div className="direita">
          <h3>Comunicados</h3>
          <Comunicados comunicados={comunicados} setComunicados={setComunicados}></Comunicados>
        </div>
      </div>
      </main>
    </div>
  );
}
