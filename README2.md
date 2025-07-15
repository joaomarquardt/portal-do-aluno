# 🎓 Portal do Aluno

> Projeto final da disciplina **Projeto Integrador 2** — um sistema completo e funcional de gestão acadêmica, com autenticação e permissões por tipo de usuário.
> objetivo é oferecer um ambiente unificado onde os alunos possam consultar suas informações pessoais, inscrever-se em disciplinas, visualizar horários de aula,
>  acompanhar notas e presenças, além de receber comunicados institucionais. Os professores poderão acessar as turmas sob sua responsabilidade e realizar o lançamento de notas e presenças.
>  O sistema também contará com um Administrador, responsável pela publicação de comunicados oficiais aos alunos e registro de disciplinas. As principais entidades do domínio incluem Aluno, P
> rofessor, Disciplina, Matrícula, Nota, Presença, Horário e Comunicado. As interações entre essas entidades permitirão o controle básico da vida acadêmica dos alunos,
>  respeitando uma estrutura racional de relacionamentos.

---

## 🛠️ Tecnologias Utilizadas

| Camada        | Tecnologias                                 |
|---------------|----------------------------------------------|
| **Backend**   | Java, Spring Boot, Spring Security, Redis   |
| **Frontend**  | React, Vite, TypeScript, Tailwind CSS       |
| **Banco de Dados** | MySQL                                   |

---

## 🎯 Funcionalidades por Tipo de Usuário

### 👨‍💼 Administrador
- Cadastro de **alunos**, **professores** e **disciplinas**
- Criação e gerenciamento de **turmas**
- Definição de **períodos letivos**
- Painel de indicadores com:
  - Média de notas dos alunos
  - Disciplinas com mais inscritos
  - Informações consolidadas do desempenho acadêmico

### 👩‍🏫 Professor
- Cadastro de **notas** e **presenças**
- Acesso a **turmas ativas** e **anteriores**

### 👨‍🎓 Aluno
-  Visualização de **notas** e **presenças**
-  Inscrição em **turmas disponíveis**
-  Acompanhamento da própria trajetória acadêmica

---

## 🧱 Arquitetura da Solução

- **🔐 Backend**
  - API RESTful desenvolvida em Spring Boot
  - Segurança com Spring Security e JWT
  - Redis utilizado para cache durante login

- **💻 Frontend**
  - Interface moderna, responsiva e desacoplada via React
  - Estilização com Tailwind CSS
  - Integração com a API via requisições HTTP autenticadas

---

## 🚀 Como Rodar Localmente

### ✅ Pré-requisitos

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Java 17+](https://www.oracle.com/java/technologies/javase-downloads.html)
- [MySQL](https://www.mysql.com/)
- [Redis](https://redis.io/)
- [Node](https://nodejs.org/pt)

### 🔧 Backend

```bash
# Clone o repositório
git clone https://github.com/joaomarquardt/portal-do-aluno.git
cd portal-do-aluno/backend

# Configure o application.properties com:
# - Credenciais do MySQL
# - Host do Redis

# Execute o servidor backend
./mvnw spring-boot:run

cd ../frontend

# Instale as dependências
npm install

# Rode o ambiente de desenvolvimento
npm run dev

````
# Acesse todo o relatório da aplicação aqui
[relatório](https://docs.google.com/document/d/1ZuvFB5Qbj2wro9bED8D5XLHCjNCJR7u5hFR4zn-WgbM/edit?usp=sharing)

