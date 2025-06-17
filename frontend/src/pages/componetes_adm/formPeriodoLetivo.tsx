import React, { useState } from 'react';

export default function FormPeriodo() {
  const [ano, setAno] = useState(2025);
  const [semestre, setSemestre] = useState(1);
  const [ativo, setAtivo] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ano < 2025) {
      alert("Ano inválido");
      return;
    }

    if (semestre !== 1 && semestre !== 2) {
      alert("Semestre deve ser 1 ou 2");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/periodos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ano,
          semestre,
          ativo,
          dataInicio,
          dataFim,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar período");
      }

      const data = await response.json();
      console.log("Período cadastrado:", data);
      alert("Período cadastrado com sucesso!");

      // Resetando o formulário
      setAno(2025);
      setSemestre(1);
      setAtivo(false);
      setDataInicio("");
      setDataFim("");

    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao cadastrar período");
    }
  };

  return (
    <>
      <h2>Cadastrar Período</h2>
      <form className="formPostagem" onSubmit={handleSubmit}>

        <label htmlFor="ano">Ano:</label>
        <input
          type="number"
          id="ano"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
        />

        <label htmlFor="semestre">Semestre:</label>
        <select
          id="semestre"
          value={semestre}
          onChange={(e) => setSemestre(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>

        <label htmlFor="ativo">Ativo:</label>
        <input
          type="checkbox"
          id="ativo"
          checked={ativo}
          onChange={(e) => setAtivo(e.target.checked)}
        />

        <label htmlFor="dataInicio">Data de Início:</label>
        <input
          type="date"
          id="dataInicio"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />

        <label htmlFor="dataFim">Data de Fim:</label>
        <input
          type="date"
          id="dataFim"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />

        <button type="submit">Cadastrar Período</button>
      </form>

    </>
  );
}
