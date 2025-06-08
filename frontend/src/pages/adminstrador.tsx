import React, { useState, useEffect } from "react";
import "../styles/adm.css";
import { FaTrash } from "react-icons/fa";

type Comunicado = {
titulo: string;
mensagem: string;
};

export default function Administrador() {
  const [mostrarDashboard, setMostrarDashboard] = useState(false);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");


  useEffect(() => {
    fetch("http://localhost:3000/comunicados")
      .then(res => res.json())
      .then(data => setComunicados(data))
      .catch(err => console.error("Erro ao carregar comunicados:", err));
  }, []);

  const alternarDashboard = () => {
    setMostrarDashboard(!mostrarDashboard);
  };
  const removerComunicado = (indice: number) => {
    const novaLista = [...comunicados];
    novaLista.splice(indice, 1);
    setComunicados(novaLista);
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

      // Atualiza a lista local
      setComunicados([...comunicados, { titulo, mensagem }]);
      setTitulo("");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }
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
                <div className="comunicadoHeader">
                  <strong>{item.titulo}</strong>
                  <button
                    className="botaoLixeira"
                    onClick={() => removerComunicado(index)}
                    title="Excluir comunicado"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p>{item.mensagem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
