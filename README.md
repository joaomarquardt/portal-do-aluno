# RELATÓRIO DE TESTE DE CARGA - SLA - PORTAL DO ALUNO

## MEDIÇÕES DO SLA

### Nome do Serviço 1: **Login**

- **Tipo de operações:** leitura
- **Arquivos envolvidos:**
  - [`backend/src/main/java/com/portal_do_aluno/security/controllers/AuthenticationController.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/security/controllers/AuthenticationController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/security/services/AuthenticationService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/security/services/AuthenticationService.java)
  - [`/backend/srcsrc/main/java/com/portal_do_aluno/repositories/UsuarioRepository.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/repositories/UsuarioRepository.java)
- **Arquivos com o código fonte de medição do SLA:**
  - [`backend/teste-carga-login-post.js`](https://github.com/joaomarquardt/portal-do-aluno/blob/main/backend/teste-carga-login-post.js)
- **Data da medição:** 30/06/2025
- **Descrição das configurações:**
  - **Servidor de aplicação:** Spring Boot rodando localmente com o servidor tendo 32GB de memória RAM
  - **Processador:** Ryzen 5 5600
  - **Banco de dados:** MySQL rodando localmente com o servidor tendo 32GB de memória RAM
  - **Ferramenta de teste de carga:** K6
  - **Ambiente:** Windows 11
- **Testes de carga (SLA):**
  - **Latência média (p95):** 65.22 ms
  - **Vazão máxima estável:**  48.518691 requisições/segundo
  - **Concorrência suportada:** até 208 requisições simultâneas sem degradação crítica
  - ![Imagem do WhatsApp de 2025-06-30 à(s) 23 30 52_cf694b8b](https://github.com/user-attachments/assets/fa9bd407-d1a5-4069-a732-d9784fc865bb)


---

### Nome do Serviço 2: **Consulta de Disciplina disponíveis**

- **Tipo de operações:** leitura
- **Arquivos envolvidos:**
  - [`/backend/src/main/java/com/portal_do_aluno/controllers/DisciplinaController.java`](https://github.com/joaomarquardt/portal-do-alunobackend/src/main/java/com/portal_do_aluno/controllers/DisciplinaController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/services/DisciplinaService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/services/DisciplinaService.java)
- **Arquivos com o código fonte de medição do SLA:**
  - [`backend/teste-carga-cursos-get.js`]([https://github.com/joaomarquardt/portal-do-aluno/blob/main/backend/teste-carga-cursos-get.js]))
- **Data da medição:** 30/06/2025
- **Descrição das configurações:**
  - **Servidor de aplicação:** Spring Boot rodando localmente com o servidor tendo 32GB de memória RAM
  - **Processador:** Ryzen 5 5600
  - **Banco de dados:** MySQL rodando localmente com o servidor tendo 32GB de memória RAM
  - **Ferramenta de teste de carga:** K6
  - **Ambiente:** Windows 11 
- **Testes de carga (SLA):**
  - **Latência média (p95):** 3.72 ms
  - **Vazão máxima estável:** 171.346661 requisições/segundo
  - **Concorrência suportada:** até 434 requisições simultâneas sem degradação significativa
  - ![Imagem do WhatsApp de 2025-06-30 à(s) 23 50 09_50ae0ca2](https://github.com/user-attachments/assets/9f573575-27dc-4525-8199-ab403060f77f)

