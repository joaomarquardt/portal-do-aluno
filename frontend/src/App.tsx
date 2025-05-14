import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EsqueciSenha from './pages/EsqueciSenha';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
