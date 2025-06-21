import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


const app = express();

app.use(cors());
app.use(express.json());

// Função GET
async function sendGetTo(url, req, res) {
  try {
    const response = await fetch(process.env.URL_API + url);
    const dados = await response.json();
    res.status(200).json(dados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar dados" });
  }
}

// Função POST
async function sendPostTo(url, req, res) {
  try {
    const response = await fetch(process.env.URL_API + url, {
      method: 'POST',
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Erro no envio da postagem: ${response.status}`);
    }

    const dados = await response.json();
    res.status(200).json({ mensagem: "Postagem enviada com sucesso", dados });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao enviar postagem" });
  }
}

// Rotas
app.get("/comunicados", (req, res) => {
  sendGetTo('/comunicados', req, res);
});

app.post("/comunicados", (req, res) => {
  sendPostTo('/comunicados', req, res);
});

app.get("/alunos", (req, res) => {
  sendGetTo('/alunos', req, res);
});

app.post("/alunos", (req, res) => {
  sendPostTo('/usuarios', req, res);
});

app.post("/periodos", (req, res) => {
  sendPostTo('/periodos-letivos', req, res);
});

app.get("/cursos", (req, res) => {
  sendGetTo('/cursos', req, res);
});

app.post("/cursos", (req, res) => {
  sendPostTo('/cursos', req, res);
});

app.post("/disciplina", (req, res) => {
  sendPostTo('/disciplinas', req, res);
});

app.get("/disciplina",(req,res)=>{
  sendGetTo("/disciplinas",req,res)
})

app.post("/professores",(req,res)=>{
  sendPostTo("/usuarios",req,res)
})
app.get("/professores",(req,res)=>{
  sendGetTo("/usuarios",req,res)
})

app.post("/turmas",(req,res)=>{
  sendPostTo("/turmas",req,res)
})

// Start
app.listen(process.env.PORTA_SERVIDOR_FRONT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORTA_SERVIDOR_FRONT}`);
});
