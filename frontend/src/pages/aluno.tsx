import React, { useState, useEffect}from "react";
import "../styles/aluno.css"
import Comunicados from "./componetes_adm/comunicados";
import "../styles/adm.css"

export default function aluno(){

  const [comunicados, setComunicados] = useState<{ titulo: string; mensagem: string }[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
   useEffect(() => {
      fetch("http://localhost:3000/comunicados")
        .then(res => res.json())
        .then(data => setComunicados(data))
        .catch(err => console.error("Erro ao carregar comunicados:", err));
    }, []);
  
  return (
    <div className="container">
      <aside className="sidebar">
        <div className="user-info">
          <div className="avatar"></div>
          <button className="username-btn" onClick={toggleDropdown}>
            NOME ALUNO ▾
          </button>
        </div>

        {dropdownOpen && (
          <div className="dropdown-expanded">
            <button>Conta</button>
            <button>Configurações</button>
          </div>
        )}

        <nav className="nav-links">
          <button>Grade horária</button>
          <button>Calendário</button>
          <button>Relatórios</button>
          <button>Turmas</button>
        </nav>

        <div className="logout">
          <button>Sair</button>
        </div>
      </aside>
      <main className="content">
        <div className="direita">
          <h3>Comunicados</h3>
          <Comunicados comunicados={comunicados} setComunicados={setComunicados}></Comunicados>
        </div>
      </main>
    </div>
  );
};

