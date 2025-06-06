import express from 'express';
const app = express()

app.post("/enviarDados" ,(req,res)=>{
    res.send("olá mundo")
})

app.get("/comunicados", (req,res) =>{
    res.send("dados de comunicados")
})

app.listen(process.env.PORTA_SERVIDOR, () => console.log(`Servidor rodando na porta ${process.env.PORTA_SERVIDOR}`));