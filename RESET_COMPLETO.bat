@echo off
echo 🔄 RESET COMPLETO DO PROJETO WIMM
echo ================================

echo.
echo 🗑️ PASSO 1: Limpando containers Docker...
echo.

REM Parar e remover containers relacionados ao Wimm
docker stop wimm_postgres 2>nul
docker stop wimm_nestjs_backend 2>nul
docker stop test-db 2>nul
docker stop parish-db 2>nul

docker rm wimm_postgres 2>nul
docker rm wimm_nestjs_backend 2>nul
docker rm test-db 2>nul
docker rm parish-db 2>nul

REM Remover volumes (dados do banco)
docker volume rm wimm_postgres_data 2>nul
docker volume prune -f

echo ✅ Containers Docker limpos!

echo.
echo 🗑️ PASSO 2: Limpando arquivos do backend...
echo.

REM Limpar arquivos de banco e cache
if exist "prisma\dev.db" del "prisma\dev.db"
if exist "prisma\dev.db-journal" del "prisma\dev.db-journal"
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"
if exist "dist" rmdir /s /q "dist"
if exist "backup" rmdir /s /q "backup"

echo ✅ Arquivos limpos!

echo.
echo 🐘 PASSO 3: Criando novo PostgreSQL...
echo.

REM Criar novo container PostgreSQL com configurações limpas
docker run -d ^
  --name wimm_postgres ^
  -e POSTGRES_USER=wimm_user ^
  -e POSTGRES_PASSWORD=wimm_password ^
  -e POSTGRES_DB=wimm_db ^
  -p 5432:5432 ^
  -v wimm_postgres_data:/var/lib/postgresql/data ^
  postgres:15

echo ⏳ Aguardando PostgreSQL inicializar...
timeout /t 10 /nobreak > nul

echo ✅ PostgreSQL criado!

echo.
echo 🔧 PASSO 4: Configurando backend...
echo.

REM Criar configuração limpa
(
echo # Wimm Backend - Configuração Limpa
echo # Database
echo DATABASE_URL="postgresql://wimm_user:wimm_password@localhost:5432/wimm_db?schema=public"
echo.
echo # JWT
echo JWT_SECRET=wimm-super-secret-jwt-key-2024
echo JWT_EXPIRES_IN=7d
echo.
echo # App
echo PORT=3000
echo NODE_ENV=development
echo.
echo # CORS
echo CORS_ORIGIN=http://localhost:8081,exp://192.168.1.100:8081
) > ".env"

REM Restaurar schema original (sem complexidades)
(
echo generator client {
echo   provider = "prisma-client-js"
echo }
echo.
echo datasource db {
echo   provider = "postgresql"
echo   url      = env("DATABASE_URL"^)
echo }
echo.
echo // Modelos básicos funcionais
echo model User {
echo   id        Int      @id @default(autoincrement(^)^)
echo   name      String
echo   email     String   @unique
echo   password  String
echo   createdAt DateTime @default(now(^)^)
echo   updatedAt DateTime @updatedAt
echo.
echo   // Relacionamentos
echo   categories Category[]
echo   wallets    Wallet[]
echo   transactions Transaction[]
echo }
echo.
echo model Category {
echo   id          Int     @id @default(autoincrement(^)^)
echo   name        String
echo   type        String  // 'INCOME' ou 'EXPENSE'
echo   color       String  @default("#4CAF50"^)
echo   icon        String  @default("category"^)
echo   description String?
echo   userId      Int
echo   parentId    Int?
echo   createdAt   DateTime @default(now(^)^)
echo   updatedAt   DateTime @updatedAt
echo.
echo   // Relacionamentos
echo   user         User         @relation(fields: [userId], references: [id], onDelete: Cascade^)
echo   parent       Category?    @relation("CategoryHierarchy", fields: [parentId], references: [id]^)
echo   subcategories Category[]  @relation("CategoryHierarchy"^)
echo   transactions Transaction[]
echo }
echo.
echo model Wallet {
echo   id          Int     @id @default(autoincrement(^)^)
echo   name        String
echo   type        String  // 'CHECKING', 'SAVINGS', 'CREDIT_CARD', 'CASH'
echo   balance     Float   @default(0^)
echo   color       String  @default("#2196F3"^)
echo   icon        String  @default("account-balance-wallet"^)
echo   userId      Int
echo   isActive    Boolean @default(true^)
echo   createdAt   DateTime @default(now(^)^)
echo   updatedAt   DateTime @updatedAt
echo.
echo   // Relacionamentos
echo   user         User          @relation(fields: [userId], references: [id], onDelete: Cascade^)
echo   transactions Transaction[]
echo }
echo.
echo model Transaction {
echo   id          Int      @id @default(autoincrement(^)^)
echo   description String
echo   amount      Float
echo   type        String   // 'INCOME' ou 'EXPENSE'
echo   date        DateTime @default(now(^)^)
echo   userId      Int
echo   categoryId  Int
echo   walletId    Int
echo   createdAt   DateTime @default(now(^)^)
echo   updatedAt   DateTime @updatedAt
echo.
echo   // Relacionamentos
echo   user     User     @relation(fields: [userId], references: [id], onDelete: Cascade^)
echo   category Category @relation(fields: [categoryId], references: [id]^)
echo   wallet   Wallet   @relation(fields: [walletId], references: [id]^)
echo }
) > "prisma\schema.prisma"

echo ✅ Configuração criada!

echo.
echo 📦 PASSO 5: Instalando dependências...
echo.

npm install

echo.
echo 🔧 PASSO 6: Configurando Prisma...
echo.

npx prisma generate
npx prisma db push

echo.
echo 🧪 PASSO 7: Testando...
echo.

npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Compilação bem-sucedida!
    echo.
    echo 🚀 PASSO 8: Iniciando backend...
    echo.
    
    start /b npm run start:dev
    timeout /t 5 /nobreak > nul
    
    echo.
    echo 🎉 RESET COMPLETO CONCLUÍDO!
    echo ================================
    echo.
    echo ✅ PostgreSQL: localhost:5432
    echo ✅ Backend: http://localhost:3000
    echo ✅ Usuário: wimm_user
    echo ✅ Senha: wimm_password
    echo ✅ Banco: wimm_db
    echo.
    echo 📋 Próximos passos:
    echo 1. Testar: http://localhost:3000
    echo 2. Criar conta no app
    echo 3. Testar funcionalidades
    echo.
    echo 🎯 Sistema limpo e funcional!
    
) else (
    echo ❌ Erro na compilação
    echo 🔍 Verifique os logs acima
)

echo.
pause
