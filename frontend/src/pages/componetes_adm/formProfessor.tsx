import React, { useState } from 'react';

function FormProfessor() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailPessoal, setEmailPessoal] = useState('');
  const [emailInstitucional, setEmailInstitucional] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [siape, setSiape] = useState('');
  const [departamento, setDepartamento] = useState('');
  

//    const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
  
//       if (titulo.trim() === "" || mensagem.trim() === "") return;
  
//       try {
//         const response = await fetch("http://localhost:3000/comunicados", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ titulo, mensagem }),
//         });
  
//         const data = await response.json();
//         console.log("Resposta do servidor:", data);
  
//         setComunicados([...comunicados, { titulo, mensagem }]);
//         setTitulo("");
//         setMensagem("");
//       } catch (error) {
//         console.error("Erro ao enviar:", error);
//       }
//     };
  return (
    <div className="dashboard">
      <h2>Criar Professor</h2>
      <form className="formPostagem" onSubmit={(e) => handleSubmit(e, {
        nome, cpf, emailPessoal, emailInstitucional, telefone, senha, professor: { siape, departamento }
      })}>
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

        <label htmlFor="siape">SIAPE:</label>
        <input type="text" id="siape" value={siape} onChange={(e) => setSiape(e.target.value)} />

        <label htmlFor="departamento">Departamento:</label>
        <select id="departamento" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
          <option value="" disabled>Selecione um departamento</option>
          <option value="informática">Informática</option>
          <option value="matemática">Matemática</option>
          <option value="física">Física</option>
          <option value="engenharia">Engenharia</option>
        </select>

        <button type="submit">Cadastrar Professor</button>
      </form>
    </div>
  );
}

export default FormProfessor;
