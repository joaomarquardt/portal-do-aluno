import React, { useState } from 'react';

export default function FormDisciplina() {
  const [periodo, setperiodo] = useState(1);
  const [vagasTotais, setvagasTotais] = useState("");
  const [cargaHoraria, setcargaHoraria] = useState("");
  const [nome, setnome] = useState("");
  const [codigo, setcodigo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/disciplina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo:codigo,
          nome:nome,
          periodo:periodo,
          vagasTotais:vagasTotais,
          cargaHoraria:cargaHoraria

        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar período");
      }

      const data = await response.json();
      console.log("Período cadastrado:", data);
      alert("Período cadastrado com sucesso!");

      // Resetando o formulário
      setperiodo(1);
      setvagasTotais("30");
      setcargaHoraria("");
      setnome("");
      setcodigo("")

    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao cadastrar período");
    }
  };

  return (
    <>
      <h2>Cadastrar Disciplina</h2>
      <form className="formPostagem" onSubmit={handleSubmit}>
        <label htmlFor="nome">nome:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setnome(e.target.value)}
        />

        <label htmlFor="periodo">Perido mínimo:</label>
        <input
          type="number"
          id="periodo"
          value={periodo}
          onChange={(e) => setperiodo(Number(e.target.value))}
        />

        <label htmlFor="vagasTotais">vagasTotais:</label>
        <input
          id="vagasTotais"
          value={vagasTotais}
          onChange={(e) => setvagasTotais(e.target.value)}
        >

        </input>

        <label htmlFor="cargaHoraria">Carga horária:</label>
        <input
          type="text"
          id="cargaHoraria"
          value={cargaHoraria}
          onChange={(e) => setcargaHoraria(e.target.value)}
        />
        <label htmlFor="cargaHoraria">Código:</label>
        <input
          type="text"
          id="codigo"
          value={codigo}
          onChange={(e) => setcodigo(e.target.value)}
        />



        <button type="submit">Cadastrar disciplina</button>
      </form>
    
    </>
  );
}
