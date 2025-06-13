import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EsqueciSenha from './pages/EsqueciSenha';
import TelaAluno from './pages/aluno'
import Administrador from './pages/adminstrador'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/aluno" element={<TelaAluno/>}></Route>
        <Route path='/admin' element={<Administrador/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
