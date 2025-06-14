import React, { useState, useEffect } from 'react';

interface Curso {
  id: number;
  nome: string;
  tipo: string;
  anosDuracao: number;
  turno: string;
  departamento: string;
}

function FormAluno() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailPessoal, setEmailPessoal] = useState('');
  const [emailInstitucional, setEmailInstitucional] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [cursoID, setCursoID] = useState('');

  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error('Erro ao carregar cursos:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      nome.trim() === '' ||
      cpf.trim() === '' ||
      emailPessoal.trim() === '' ||
      emailInstitucional.trim() === '' ||
      telefone.trim() === '' ||
      senha.trim() === '' ||
      cursoID.trim() === ''
    ) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          cpf,
          emailPessoal,
          emailInstitucional,
          telefone,
          senha,
          aluno: {
            cursoID: Number(cursoID),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar aluno');
      }

      const data = await response.json();
      console.log('Resposta do servidor:', data);
      alert('Aluno cadastrado com sucesso!');

      // Resetar campos
      setNome('');
      setCpf('');
      setEmailPessoal('');
      setEmailInstitucional('');
      setTelefone('');
      setSenha('');
      setCursoID('');
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao cadastrar aluno');
    }
  };

  return (
    <div className="dashboard">
      <h2>Criar Aluno</h2>
      <form className="formPostagem" onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />

        <label htmlFor="cpf">CPF:</label>
        <input
          type="text"
          id="cpf"
          value={cpf}
          onChange={e => setCpf(e.target.value)}
        />

        <label htmlFor="emailPessoal">Email Pessoal:</label>
        <input
          type="email"
          id="emailPessoal"
          value={emailPessoal}
          onChange={e => setEmailPessoal(e.target.value)}
        />

        <label htmlFor="emailInstitucional">Email Institucional:</label>
        <input
          type="email"
          id="emailInstitucional"
          value={emailInstitucional}
          onChange={e => setEmailInstitucional(e.target.value)}
        />

        <label htmlFor="telefone">Telefone:</label>
        <input
          type="text"
          id="telefone"
          value={telefone}
          onChange={e => setTelefone(e.target.value)}
        />

        <label htmlFor="senha">Senha:</label>
        <input
          type="password"
          id="senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />

        <label htmlFor="cursoID">Curso:</label>
        <select
          id="cursoID"
          value={cursoID}
          onChange={e => setCursoID(e.target.value)}
        >
          <option value="" disabled>
            Selecione um curso
          </option>
          {cursos.map(curso => (
            <option key={curso.id} value={curso.id}>
              {curso.nome} ({curso.turno})
            </option>
          ))}
        </select>

        <button type="submit">Cadastrar Aluno</button>
      </form>
    </div>
  );
}

export default FormAluno;
