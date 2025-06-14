import express from 'express';
import cors from 'cors';

const app = express()

app.use(cors());
app.use(express.json())

async function sendGetTo(url,req,res){
  try {
    const response = await fetch(process.env.URL_API + url);
    const dados = await response.json();
    res.status(200).json(dados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao buscar comunicados" });
  }
}

function sendPostTo(url,req,res){
  fetch(process.env.URL_API + url, {
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
}

app.get("/comunicados", async (req, res) => {
  sendGetTo('/comunicados',req,res)
});


app.post("/comunicados", (req, res) => {
  sendPostTo("/comunicados",req,res)
});

app.get("/alunos", async (req,res)=>{
  sendGetTo("/usuarios",req,res)
})

app.post("/alunos", async (req,res)=>{
  sendPostTo("usuarios",req,res)
})

app.post("/periodos", (req,res)=>{
  sendPostTo("/periodos-letivos", req,res);
})

app.get("/cursos",(req,res)=>{
  sendGetTo("/cursos",req,res);
})



app.listen(process.env.PORTA_SERVIDOR_FRONT, () => console.log(`Servidor rodando na porta ${process.env.PORTA_SERVIDOR_FRONT}`));