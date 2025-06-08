import React, { useState }from "react";
import "../styles/aluno.css"



export default function aluno(){
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
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
      <main className="content"></main>
    </div>
  );
};

