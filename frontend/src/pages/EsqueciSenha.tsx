import '../styles/login.css';

const EsqueciSenha = () => {
  return (
    <div className="login-container">
      <h1>PORTAL DO ALUNO</h1>
      <div className="login-box">
        <h2>Recuperar Senha</h2>
        <p style={{ marginBottom: '1rem' }}>
          Informe o CPF para receber um link de redefinição de senha.
        </p>
        <form>
          <label htmlFor="cpf">CPF</label>
          <input type="text" id="cpf" placeholder="Digite seu CPF" />

          <button type="submit" className="login-button" style={{ marginTop: '1.5rem' }}>
            Enviar link de recuperação
          </button>
        </form>
        <a href="/" className="forgot-password">Voltar para o login</a>
      </div>
    </div>
  );
};

export default EsqueciSenha;
