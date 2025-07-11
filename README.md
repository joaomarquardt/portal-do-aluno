# RELATÓRIO DE TESTE DE CARGA - SLA - PORTAL DO ALUNO

## MEDIÇÕES DO SLA

### Nome do Serviço 1: **Login**

#### Medição 1:

- **Tipo de operações:** leitura
- **Arquivos envolvidos:**
  - [`backend/src/main/java/com/portal_do_aluno/security/controllers/AuthenticationController.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/security/controllers/AuthenticationController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/security/services/AuthenticationService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/security/services/AuthenticationService.java)
  - [`/backend/srcsrc/main/java/com/portal_do_aluno/repositories/UsuarioRepository.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/repositories/UsuarioRepository.java)
- **Arquivos com o código fonte de medição do SLA:**
  - [`backend/teste-carga-login-post.js`](backend/teste-carga-login-post.js)
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


#### Medição 2:

- **Tipo de operações:** leitura
- **Arquivos envolvidos:**
  - [`backend/src/main/java/com/portal_do_aluno/security/controllers/AuthenticationController.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/security/controllers/AuthenticationController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/security/services/AuthenticationService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/security/services/AuthenticationService.java)
  - [`/backend/srcsrc/main/java/com/portal_do_aluno/repositories/UsuarioRepository.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/repositories/UsuarioRepository.java)
- **Arquivos com o código fonte de medição do SLA:**
  - [`backend/teste-carga-login-post.js`](backend/teste-carga-login-post.js)
- **Data da medição:** 10/07/2025
- **Descrição das configurações:**
  - **Servidor de aplicação:** Spring Boot rodando localmente com o servidor tendo 32GB de memória RAM
  - **Processador:** Ryzen 5 5600
  - **Banco de dados:** MySQL rodando localmente com o servidor tendo 32GB de memória RAM
  - **Ferramenta de teste de carga:** K6
  - **Ambiente:** Windows 11
- **Testes de carga (SLA):**
  - **Latência média (p95):** 71.89 ms
  - **Vazão máxima estável:**  97 requisições/segundo (margem de segurança de 15% em relação a capacidade máxima observada)
  - **Concorrência suportada:** até 114 requisições simultâneas sem degradação crítica
  - ![Imagem do WhatsApp de 2025-07-10 à(s) 21 04 45_631e8147](https://github.com/user-attachments/assets/c5a34f10-3542-4dc6-890f-6883a6e6693c)

#### Considerações: 
Foram realizados dois testes de carga com a ferramenta K6, nos dias 30 de junho e 10 de julho de 2025, em um ambiente local com Spring Boot, MySQL, 32 GB de RAM e processador Ryzen 5 5600. No primeiro teste, a vazão máxima estável foi de 48,52 requisições por segundo, com latência p95 de 65,22 ms e suporte a 208 requisições simultâneas sem degradação.
No segundo teste, a vazão dobrou, chegando a 97 requisições por segundo, com uma leve elevação na latência p95 para 71,89 ms. Apesar da redução na concorrência simultânea para 114 requisições, o sistema respondeu mais rápido, o que explica essa diminuição. Não foram identificados gargalos.
A comparação mostra que o sistema está mais eficiente, suportando maior carga com estabilidade e sem comprometer o tempo de resposta.

#### Gráfico comparativo:
<img width="1000" height="600" alt="image" src="https://github.com/user-attachments/assets/ce525bf4-67c2-4998-acce-2e3e44f07a6f" />



---


### Nome do Serviço 2: **Consulta de Média Geral**

#### Medição 1:

- **Tipo de operações:** leitura
- **Arquivos envolvidos:**
  - [`/backend/src/main/java/com/portal_do_aluno/controllers/AlunoController.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/controllers/AlunoController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/controllers/DisciplinaController.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/controllers/DisciplinaController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/services/AlunoService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/services/AlunoService.java)
  - [`/backend/src/main/java/com/portal_do_aluno/services/DisciplinaService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/services/DisciplinaService.java)
  - [`/backend/src/main/java/com/portal_do_aluno/repositories/AlunoRepository.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/repositories/AlunoRepository.java)
  - [`/backend/src/main/java/com/portal_do_aluno/repositories/DisciplinaRepository.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/repositories/DisciplinaRepository.java)
- **Arquivos com o código fonte de medição do SLA:**
  - [`backend/teste-carga-medias-get.js`]([backend/teste-carga-medias-get.js]))
- **Data da medição:** 08/07/2025
- **Descrição das configurações:**
  - **Servidor de aplicação:** Spring Boot rodando localmente com o servidor tendo 32GB de memória RAM
  - **Processador:** Ryzen 5 5600
  - **Banco de dados:** MySQL rodando localmente com o servidor tendo 32GB de memória RAM
  - **Ferramenta de teste de carga:** K6
  - **Ambiente:** Windows 11 
- **Testes de carga (SLA):**
  - **Latência média (p95):** 7.01 ms
  - **Vazão máxima estável:** 95.2 requisições/segundo (margem de segurança de 15% em relação a capacidade máxima observada)
  - **Concorrência suportada:** até 112 requisições simultâneas sem degradação significativa
  - ![Imagem do WhatsApp de 2025-07-10 à(s) 20 30 01_161b44c0](https://github.com/user-attachments/assets/fec2b54c-b167-463c-a7f3-7f2325286109)

 
#### Medição 2:

- **Tipo de operações:** leitura
- **Arquivos envolvidos:**
  - [`/backend/src/main/java/com/portal_do_aluno/controllers/AlunoController.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/controllers/AlunoController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/controllers/DisciplinaController.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/controllers/DisciplinaController.java)
  - [`/backend/src/main/java/com/portal_do_aluno/services/AlunoService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/services/AlunoService.java)
  - [`/backend/src/main/java/com/portal_do_aluno/services/DisciplinaService.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/services/DisciplinaService.java)
  - [`/backend/src/main/java/com/portal_do_aluno/repositories/AlunoRepository.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/repositories/AlunoRepository.java)
  - [`/backend/src/main/java/com/portal_do_aluno/repositories/DisciplinaRepository.java`](https://github.com/joaomarquardt/portal-do-aluno/backend/src/main/java/com/portal_do_aluno/repositories/DisciplinaRepository.java)
- **Arquivos com o código fonte de medição do SLA:**
  - [`backend/teste-carga-medias-get.js`]([backend/teste-carga-medias-get.js]))
- **Data da medição:** 10/07/2025
- **Descrição das configurações:**
  - **Servidor de aplicação:** Spring Boot rodando localmente com o servidor tendo 32GB de memória RAM
  - **Processador:** Ryzen 5 5600
  - **Banco de dados:** MySQL rodando localmente com o servidor tendo 32GB de memória RAM
  - **Ferramenta de teste de carga:** K6
  - **Ambiente:** Windows 11 
- **Testes de carga (SLA):**
  - **Latência média (p95):** 2.52 ms
  - **Vazão máxima estável:** 352.75 requisições/segundo (margem de segurança de 15% em relação a capacidade máxima observada)
  - **Concorrência suportada:** até 415 requisições simultâneas sem degradação significativa
  - ![Imagem do WhatsApp de 2025-07-10 à(s) 20 45 10_0241e874](https://github.com/user-attachments/assets/aa382b6f-ac0e-4c55-9076-4495eba0e989)
 
#### Considerações: 
A análise comparativa entre as Medições 1 e 2 revela uma melhoria substancial de desempenho. Na Medição 1, o sistema registrou uma latência média (p95) de $7.01$ milissegundos, com uma vazão estável de $95.2$ requisições por segundo e suporte para até $112$ requisições simultâneas. Em contraste, a Medição 2, realizada após otimizações, apresentou resultados superiores: a latência p95 foi reduzida para $2.52$ milissegundos, a vazão estável aumentou para $352.75$ requisições por segundo, e a capacidade de concorrência expandiu-se para $415$ requisições simultâneas, mantendo a estabilidade. Esses dados indicam um ganho significativo em eficiência, responsividade e robustez do sistema.

#### Gráfico comparativo:
<img width="1000" height="600" alt="image" src="https://github.com/user-attachments/assets/fa7e5b7f-a286-4f46-81ab-5589e6efae49" />


