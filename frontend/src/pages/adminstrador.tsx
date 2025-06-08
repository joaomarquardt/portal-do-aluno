import React, { useState } from "react";
import "../styles/adm.css";

type Comunicado = {
titulo: string;
mensagem: string;
};

export default function Administrador() {
  const [mostrarDashboard, setMostrarDashboard] = useState(false);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");


  // resto do código...

  const alternarDashboard = () => {
    setMostrarDashboard(!mostrarDashboard);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (titulo.trim() === "" || mensagem.trim() === "") return;

    setComunicados([...comunicados, { titulo, mensagem }]);
    setTitulo("");
    setMensagem(""); // opcional: fecha o painel após envio
  };

  return (
    <section className="TelaAdminstrador">
      <div className="headerPai">
        <div className="HeaderInfos">
          <span>RJ</span>
          <span>UNIRIO</span>
        </div>
      </div>
      <div className="headerFilho">
        <span>Administrador</span>
      </div>
      <div className="conteudoHeader">
        <span>Bem-vindo</span>
      </div>
      <div className="conteudo">
        <div className="esquerda">
          <button className="botaoDashboard" onClick={alternarDashboard}>
            {mostrarDashboard ? "Fechar painel" : "Criar postagem"}
          </button>

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
          <div className="listaComunicados">
            {comunicados.map((item, index) => (
              <div key={index} className="comunicado">
                <strong>{item.titulo}</strong>
                <p>{item.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
