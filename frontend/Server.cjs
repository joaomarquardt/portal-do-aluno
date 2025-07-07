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

app.post('/api/login', (req, res) => {
    login("/auth/login",{req, res});
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});