import React, { useState } from 'react';

function FormAluno() {


  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailPessoal, setEmailPessoal] = useState('');
  const [emailInstitucional, setEmailInstitucional] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [cursoID, setCursoID] = useState('');


   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (nome.trim() === "" || cpf.trim() === "" || emailPessoal.trim() === "" || emailInstitucional.trim() === "" || telefone.trim() === "" || senha.trim() === "" ) return;

      try {
        const response = await fetch("http://localhost:3000/alunos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            nome:nome, 
            cpf:cpf,
            emailPessoal:emailPessoal,
            emailInstitucional:emailInstitucional,
            telefone:telefone,
            senha:senha,
            aluno:{
              cursoID:parseInt(cursoID)
            } 
          }),
        });
  
        const data = await response.json();
        console.log("Resposta do servidor:", data);
  
      } catch (error) {
        console.error("Erro ao enviar:", error);
      }
    };
  return (
    <div className="dashboard">
      <h2>Criar Aluno</h2>
      <form className="formPostagem" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="nome">Nome:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />

        <label htmlFor="cpf">CPF:</label>
        <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} />

        <label htmlFor="emailPessoal">Email Pessoal:</label>
        <input type="email" id="emailPessoal" value={emailPessoal} onChange={(e) => setEmailPessoal(e.target.value)} />

        <label htmlFor="emailInstitucional">Email Institucional:</label>
        <input type="email" id="emailInstitucional" value={emailInstitucional} onChange={(e) => setEmailInstitucional(e.target.value)} />

        <label htmlFor="telefone">Telefone:</label>
        <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />

        <label htmlFor="cursoID">Curso:</label>
        <select id="cursoID" value={cursoID} onChange={(e) => setCursoID(e.target.value)}>
          <option value="" disabled>Selecione um curso</option>
          <option value="1">Engenharia de Software</option>
          <option value="2">Ciência da Computação</option>
          <option value="3">Sistemas de Informação</option>
        </select>

        <button type="submit">Cadastrar Aluno</button>
      </form>
    </div>
  );
}

export default FormAluno;
