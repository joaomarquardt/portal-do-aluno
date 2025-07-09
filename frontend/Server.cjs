const express = require('express');
const cors = require('cors'); 
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

async function login(url, { req, res }) {
  console.log("teste")
  try {
    console.log("Dados recebidos no body:", req.body);

    const response = await fetch(`${process.env.URL_API}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status, response.statusText);
      return res.status(response.status).json({ erro: "Erro ao autenticar." });
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}

async function sendAuthPostTo(url, req, res, token) {
  console.log("TOKEN NO SERVIDOR: " + token)
  let newToken = token.substring(7)
  console.log("TOKEN VALIDADO: " + newToken)
  try {
    if (!process.env.URL_API) {
      console.error("URL_API não definida.");
      return res.status(500).json({ erro: "Configuração do servidor inválida." });
    }

    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ erro: "Corpo da requisição inválido." });
    }

    console.log("Dados recebidos no body:", req.body);

    const response = await fetch(`${process.env.URL_API}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${newToken}`
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status, response.statusText);
      return res.status(response.status).json({ erro: "Erro ao autenticar." });
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}



async function sendAuthGetTo(url, req, res, token) {
  console.log("TOKEN NO SERVIDOR: " + token)
  let newToken = token.substring(7)
  console.log("TOKEN VALIDADO: " + newToken)
  try {
    if (!process.env.URL_API) {
      console.error("URL_API não definida.");
      return res.status(500).json({ erro: "Configuração do servidor inválida." });
    }

    const response = await fetch(`${process.env.URL_API}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${newToken}`
      }
    });

    if (!response.ok) {
      console.error("Erro na requisição:", response.status, response.statusText);
      return res.status(response.status).json({ erro: "Erro ao autenticar." });
    }

    const data = await response.json();
    console.log("Resposta da API:", data);

    return res.status(response.status).json(data);

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ erro: "Erro interno no servidor." });
  }
}









app.post('/api/login', (req, res) => {
    login("/auth/login",{req, res});
});

app.post("/create/periodo-letivo",(req,res) =>{
  sendAuthPostTo("/periodos-letivos", req,res, req.headers.authorization)
})

app.get("/periodo-letivo",(req,res) =>{
  sendAuthGetTo("/periodos-letivos",req,res,req.headers.authorization)
})
app.get("/turmas",(req,res) =>{
  sendAuthGetTo("/turmas",req,res,req.headers.authorization)
})

app.post("/professores",(req,res)=>{
  sendAuthPostTo("/auth/register",req,res,req.headers.authorization)
})
app.get("/professores",(req,res)=>{
  sendAuthGetTo("/professors",req,res,req.headers.authorization)
})


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});