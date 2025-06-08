import express from 'express';
import cors from 'cors';

const app = express()

app.use(cors());
app.use(express.json())

app.get("/comunicados", async (req, res) => {
  try {
    const response = await fetch(process.env.URL_API + "/comunicados");
    const dados = await response.json();
    res.status(200).json(dados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar comunicados" });
  }
});


app.post("/comunicados", (req, res) => {
    fetch(process.env.URL_API + "/comunicados", {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(req.body)
    })
        .then(response => {
            if (!response.ok)
                throw new Error(`Erro no envio da postagem: ${response.status}`);
            return response.json();
        })
        .then(dados => {
            console.log(dados);
            res.status(200).json({ mensagem: "Postagem enviada com sucesso", dados });
        })
        .catch(erro => {
            console.error(erro);
            res.status(500).json({ erro: "Erro ao enviar postagem" });
        });
});


app.listen(process.env.PORTA_SERVIDOR_FRONT, () => console.log(`Servidor rodando na porta ${process.env.PORTA_SERVIDOR_FRONT}`));