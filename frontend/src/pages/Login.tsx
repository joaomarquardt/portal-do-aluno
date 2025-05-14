import '../styles/login.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [userType, setUserType] = useState<'Aluno' | 'Professor'>('Aluno');

  return (
    <div className="login-container">
      <h1>PORTAL DO ALUNO</h1>
      <div className="login-box">
        <h2>Login</h2>
        <div className="user-type">
          <button
            className={`btn ${userType === 'Aluno' ? 'active' : ''}`}
            onClick={() => setUserType('Aluno')}
            type="button"
          >
            Aluno
          </button>
          <button
            className={`btn ${userType === 'Professor' ? 'active' : ''}`}
            onClick={() => setUserType('Professor')}
            type="button"
          >
            Professor
          </button>
        </div>
        <form>
          <label htmlFor="cpf">CPF</label>
          <input type="text" id="cpf" placeholder="Digite seu CPF" />

          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" placeholder="Digite sua senha" />

          <div className="remember">
            <input type="checkbox" id="manter-conectado" />
            <label htmlFor="manter-conectado">Manter conectado?</label>
          </div>

          <button type="submit" className="login-button">Entrar</button>
          <Link to="/esqueci-senha" className="forgot-password">Esqueci a senha</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
