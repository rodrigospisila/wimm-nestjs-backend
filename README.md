
# Wimm - Backend NestJS

Este é o backend do aplicativo **Wimm - Where is my money?**, desenvolvido com **NestJS**, **TypeScript**, **PostgreSQL** e **Prisma**.

## 🚀 Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [NestJS CLI](https://docs.nestjs.com/): `npm install -g @nestjs/cli`

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd wimm_nestjs_backend
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   - Renomeie o arquivo `.env.example` para `.env`.
   - Atualize a variável `DATABASE_URL` com a sua string de conexão do PostgreSQL:
     ```
     DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
     ```
   - Defina a variável `JWT_SECRET` com uma chave secreta segura.

4. **Execute as migrações do banco de dados:**
   ```bash
   npx prisma migrate dev --name init
   ```

### Executando a Aplicação

```bash
# Modo de desenvolvimento com watch
pnpm run start:dev

# Modo de produção
pnpm run build
pnpm run start:prod
```

A aplicação estará disponível em `http://localhost:3000`.

## 🛠️ Estrutura do Projeto

- `src/`
  - `auth/`: Módulo de autenticação (registro, login, JWT).
  - `prisma/`: Schema e serviço do Prisma ORM.
  - `wallets/`: Módulo de gerenciamento de carteiras.
  - `app.module.ts`: Módulo principal da aplicação.
  - `main.ts`: Arquivo de entrada da aplicação.
- `prisma/`
  - `schema.prisma`: Definição dos modelos de dados.
  - `migrations/`: Arquivos de migração do banco de dados.

## 📄 API Endpoints

A documentação completa da API pode ser gerada com o Swagger (não implementado neste MVP) ou consultada no arquivo `api_documentation.md`.

- `POST /auth/register`: Registrar um novo usuário.
- `POST /auth/login`: Realizar login.
- `GET /auth/me`: Obter informações do usuário autenticado.
- `GET /wallets`: Listar carteiras do usuário.
- `POST /wallets`: Criar uma nova carteira.
- `GET /wallets/summary`: Obter um resumo financeiro.


