import React, { useState } from 'react';

export default function FormCursos() {
  const [tipo, settipo] = useState("");
  const [anosDuracao, setanosDuracao] = useState(1);
  const [departamento, setdepartamento] = useState("");
  const [nome, setnome] = useState("");
  const [turno, setturno] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome:nome,
          tipo:tipo,
          anosDuracao:anosDuracao,
          turno:turno,
          departamento:departamento

        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar período");
      }

      const data = await response.json();
      console.log("Período cadastrado:", data);
      alert("Período cadastrado com sucesso!");

      // Resetando o formulário
      settipo("");
      setanosDuracao(1);
      setdepartamento("");
      setnome("");
      setturno("")

    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao cadastrar período");
    }
  };

  return (
      <>
      <h2>Cadastrar Período</h2>
      <form className="formPostagem" onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setnome(e.target.value)}
        />

        <label htmlFor="tipo">Perido mínimo:</label>
        <select
          id="tipo"
          value={tipo}
          onChange={e => settipo(e.target.value)}
        >
          <option value="" disabled>
            Selecione um modelo
          </option>
          <option value="híbrido">
            Híbrido
          </option>
          <option value="Presencial">
            Presencial
          </option>
        </select>


        <label htmlFor="anosDuracao">Duração (em anos):</label>
        <input
        type='number'
          id="anosDuracao"
          value={anosDuracao}
          onChange={(e) => setanosDuracao(Number(e.target.value))}
        >

        </input>

        <label htmlFor="departamento">Carga horária:</label>
        <input
          type="text"
          id="departamento"
          value={departamento}
          onChange={(e) => setdepartamento(e.target.value)}
        />
        <label htmlFor="departamento">Turno:</label>
        <select
          id="turno"
          value={turno}
          onChange={(e) => setturno(e.target.value)}
        >

        <option value="" disabled>
            Selecione um turno
          </option>
          <option value="Diurno">
            Diurno
          </option>
          <option value="Noturno">
            Noturno
          </option>
            <option value="Vespertino">
            Vespertino
          </option>
            <option value="Matutino">
            Matutino
          </option>
        </select>
        


        <button type="submit">Cadastrar disciplina</button>
      </form>
      </>
      
   );
}
