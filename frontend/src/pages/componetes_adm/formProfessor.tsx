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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples
    if (
      !nome.trim() ||
      !cpf.trim() ||
      !emailPessoal.trim() ||
      !emailInstitucional.trim() ||
      !telefone.trim() ||
      !senha.trim() ||
      !siape.trim() ||
      !departamento.trim()
    ) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const payload = {
      nome:nome,
      cpf:cpf,
      emailPessoal:emailPessoal,
      emailInstitucional:emailInstitucional,
      telefone:telefone,
      senha:senha,
      professor: {
        siape:siape,
        departamento:departamento,
      },
    };

    try {
      const response = await fetch('http://localhost:3000/professores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar professor');
      }

      const data = await response.json();
      console.log('Professor cadastrado com sucesso:', data);
      alert('Professor cadastrado com sucesso!');

      // Resetando os campos
      setNome('');
      setCpf('');
      setEmailPessoal('');
      setEmailInstitucional('');
      setTelefone('');
      setSenha('');
      setSiape('');
      setDepartamento('');
    } catch (error) {
      console.error('Erro ao cadastrar professor:', error);
      alert('Erro ao cadastrar professor. Tente novamente.');
    }
  };

  return (
      <>
        <h2>Criar Professor</h2>
      <form className="formPostagem" onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />

        <label htmlFor="emailPessoal">Email Pessoal:</label>
        <input
          type="email"
          id="emailPessoal"
          value={emailPessoal}
          onChange={(e) => setEmailPessoal(e.target.value)}
        />

        <label htmlFor="emailInstitucional">Email Institucional:</label>
        <input
          type="email"
          id="emailInstitucional"
          value={emailInstitucional}
          onChange={(e) => setEmailInstitucional(e.target.value)}
        />

        <label htmlFor="telefone">Telefone:</label>
        <input
          type="text"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <label htmlFor="senha">Senha:</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <label htmlFor="siape">SIAPE:</label>
        <input
          type="text"
          id="siape"
          value={siape}
          onChange={(e) => setSiape(e.target.value)}
        />

        <label htmlFor="departamento">Departamento:</label>
        <input
          type='text'
          id="departamento"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
        >

        </input>

        <button type="submit">Cadastrar Professor</button>
      </form>
      </>
      
   );
}

export default FormProfessor;
