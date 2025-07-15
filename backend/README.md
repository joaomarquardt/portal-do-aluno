# Portal do Aluno - API - Backend

Esta é a API backend do projeto **Portal do Aluno**, desenvolvida em Java com Spring Boot. Ela fornece serviços de autenticação, gerenciamento de usuários, cursos, disciplinas, comunicações, turmas e desempenho escolar.

## Sumário

* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Instalação](#instalação)
* [Autenticação e Autorização](#autenticação-e-autorização)
* [Endpoints](#endpoints)

  * [Autenticação](#autenticação)
  * [Usuários](#usuários)
  * [Alunos](#alunos)
  * [Professores](#professores)
  * [Cursos](#cursos)
  * [Disciplinas](#disciplinas)
  * [Períodos Letivos](#períodos-letivos)
  * [Turmas](#turmas)
  * [Comunicados](#comunicados)
* [Controle de Acesso](#controle-de-acesso)

---

## Tecnologias Utilizadas

* Java 17
* Spring Boot 3.x
* Spring Security com JWT
* MySQL
* Redis (para controle de blacklist do JWT)
* Maven

## Instalação

```bash
# Clone o repositório
$ git clone https://github.com/seu-usuario/portal-do-aluno-api.git
$ cd portal-do-aluno-api

# Configure o application.properties com as credenciais do MySQL e Redis

# Execute o projeto
$ ./mvnw spring-boot:run
```

---

## Autenticação e Autorização

A API utiliza **JWT** para autenticação. O fluxo é:

1. Login: `POST /auth/login`
2. O token JWT é retornado e deve ser enviado nos headers das requisições seguintes:

   ```http
   Authorization: Bearer <token>
   ```
3. O token pode ser invalidado com `POST /auth/logout`.
4. A troca de senha é feita via `PUT /auth/{id}/senha`.

---

## Endpoints

### Autenticação

| Verbo | Endpoint           | Descrição                                                  |
| ----- | ------------------ | ---------------------------------------------------------- |
| POST  | `/auth/login`      | Realiza login e retorna token JWT + flag de troca de senha |
| POST  | `/auth/register`   | Registra um novo usuário (ADMIN)                           |
| POST  | `/auth/logout`     | Invalida o token JWT                                       |
| PUT   | `/auth/{id}/senha` | Atualiza a senha de um usuário                             |

### Usuários

| Verbo  | Endpoint         | Descrição                 |
| ------ | ---------------- | ------------------------- |
| GET    | `/usuarios`      | Lista todos os usuários   |
| GET    | `/usuarios/{id}` | Detalhes de um usuário    |
| PUT    | `/usuarios/{id}` | Atualiza dados de contato |
| DELETE | `/usuarios/{id}` | Deleta usuário            |

### Alunos

| Verbo  | Endpoint                         | Descrição                           |
| ------ | -------------------------------- | ----------------------------------- |
| GET    | `/alunos`                        | Lista todos os alunos               |
| GET    | `/alunos/paginacao`              | Lista todos os alunos com paginação |
| GET    | `/alunos/{id}`                   | Detalhes de um aluno                |
| GET    | `/alunos/{id}/desempenho-geral`  | Detalhes do desempenho do aluno     |
| GET    | `/alunos/total-alunos`           | Número de alunos cadastrados        |
| GET    | `/alunos/{id}/turmas`            | Lista as turmas do aluno            |
| GET    | `/alunos/{id}/sumario-dashboard` | Informações para interface do aluno |
| POST   | `/alunos`                        | Cadastra aluno                      |
| PUT    | `/alunos/{id}`                   | Atualiza aluno                      |
| DELETE | `/alunos/{id}`                   | Remove aluno                        |

### Professores

| Verbo  | Endpoint                              | Descrição                               |
| ------ | ------------------------------------- | --------------------------------------- |
| GET    | `/professores`                        | Lista professores                       |
| GET    | `/professores/{id}`                   | Detalhes de um professor                |
| GET    | `/professores/select`                 | Lista para seleção (dropdown)           |
| POST   | `/professores`                        | Cadastra professor                      |
| PUT    | `/professores/{id}`                   | Atualiza professor                      |
| DELETE | `/professores/{id}`                   | Remove professor                        |
| GET    | `/professores/{id}/sumario-dashboard` | Informações para interface do professor |
| GET    | `/professores/{id}/turmas-ativas`     | Turmas ativas do professor              |

### Cursos

| Verbo  | Endpoint       | Descrição            |
| ------ | -------------- | -------------------- |
| GET    | `/cursos`      | Lista cursos         |
| GET    | `/cursos/{id}` | Detalhes de um curso |
| POST   | `/cursos`      | Cadastra curso       |
| PUT    | `/cursos/{id}` | Atualiza curso       |
| DELETE | `/cursos/{id}` | Remove curso         |

### Disciplinas

| Verbo  | Endpoint            | Descrição              |
| ------ | ------------------- | ---------------------- |
| GET    | `/disciplinas`      | Lista disciplinas      |
| GET    | `/disciplinas/{id}` | Detalhes de disciplina |
| POST   | `/disciplinas`      | Cadastra disciplina    |
| PUT    | `/disciplinas/{id}` | Atualiza disciplina    |
| DELETE | `/disciplinas/{id}` | Remove disciplina      |

### Períodos Letivos

| Verbo  | Endpoint                 | Descrição              |
| ------ | ------------------------ | ---------------------- |
| GET    | `/periodos-letivos`      | Lista períodos letivos |
| GET    | `/periodos-letivos/{id}` | Detalhes de um período |
| POST   | `/periodos-letivos`      | Cadastra novo período  |
| PUT    | `/periodos-letivos/{id}` | Atualiza período       |
| DELETE | `/periodos-letivos/{id}` | Remove período         |

### Turmas

| Verbo  | Endpoint                             | Descrição                                   |
| ------ | ------------------------------------ | ------------------------------------------- |
| GET    | `/turmas`                            | Lista turmas                                |
| GET    | `/turmas/{id}`                       | Detalhes de uma turma                       |
| POST   | `/turmas`                            | Cadastra turma                              |
| POST   | `/turmas/{idTurma}/alunos`           | Adiciona alunos a turma                     |
| GET    | `/turmas/{idTurma}/alunos`           | Lista alunos de uma turma                   |
| PUT    | `/turmas/{idTurma}/alunos/{idAluno}` | Atualiza desempenho de aluno                |
| PUT    | `/turmas/{id}`                       | Atualiza turma                              |
| DELETE | `/turmas/{id}`                       | Remove turma                                |
| GET    | `/turmas/media-geral`                | Média geral de todas as turmas              |
| GET    | `/turmas/sumario-dashboard`          | Informações para interface do administrador |

### Comunicados

| Verbo  | Endpoint            | Descrição              |
| ------ | ------------------- | ---------------------- |
| GET    | `/comunicados`      | Lista comunicados      |
| GET    | `/comunicados/{id}` | Detalhes de comunicado |
| POST   | `/comunicados`      | Cria comunicado        |
| PUT    | `/comunicados/{id}` | Atualiza comunicado    |
| DELETE | `/comunicados/{id}` | Remove comunicado      |

---

## Controle de Acesso

O controle de acesso é baseado em **Roles**. Cada token JWT contém os papéis do usuário:

* `ROLE_ADMIN`: Acesso total a todos os recursos
* `ROLE_ALUNO`: Acesso a seus dados e desempenho
* `ROLE_PROFESSOR`: Acesso às turmas e desempenho de seus alunos

As regras estão definidas no `SecurityFilterChain` do Spring Security.

---

## Licença

Este projeto está licenciado sob a MIT License.
