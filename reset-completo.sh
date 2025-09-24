#!/bin/bash

echo "🔄 RESET COMPLETO DO PROJETO WIMM"
echo "================================"
echo

echo "🗑️ PASSO 1: Limpando containers Docker..."
echo

# Parar e remover containers relacionados ao Wimm
docker stop wimm_postgres wimm_nestjs_backend test-db parish-db 2>/dev/null
docker rm wimm_postgres wimm_nestjs_backend test-db parish-db 2>/dev/null

# Remover volumes (dados do banco)
docker volume rm wimm_postgres_data 2>/dev/null
docker volume prune -f

echo "✅ Containers Docker limpos!"
echo

echo "🗑️ PASSO 2: Limpando arquivos do backend..."
echo

# Limpar arquivos de banco e cache
rm -f prisma/dev.db prisma/dev.db-journal
rm -rf prisma/migrations
rm -rf node_modules/.prisma
rm -rf dist
rm -rf backup

echo "✅ Arquivos limpos!"
echo

echo "🐘 PASSO 3: Criando novo PostgreSQL..."
echo

# Criar novo container PostgreSQL com configurações limpas
docker run -d \
  --name wimm_postgres \
  -e POSTGRES_USER=wimm_user \
  -e POSTGRES_PASSWORD=wimm_password \
  -e POSTGRES_DB=wimm_db \
  -p 5432:5432 \
  -v wimm_postgres_data:/var/lib/postgresql/data \
  postgres:15

echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

echo "✅ PostgreSQL criado!"
echo

echo "🔧 PASSO 4: Configurando backend..."
echo

# Criar configuração limpa
cat > .env << 'EOF'
# Wimm Backend - Configuração Limpa

# Database
DATABASE_URL="postgresql://wimm_user:wimm_password@localhost:5432/wimm_db?schema=public"

# JWT
JWT_SECRET=wimm-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:8081,exp://192.168.1.100:8081
EOF

# Restaurar schema original (sem complexidades)
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelos básicos funcionais
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos
  categories Category[]
  wallets    Wallet[]
  transactions Transaction[]
}

model Category {
  id          Int     @id @default(autoincrement())
  name        String
  type        String  // 'INCOME' ou 'EXPENSE'
  color       String  @default("#4CAF50")
  icon        String  @default("category")
  description String?
  userId      Int
  parentId    Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent       Category?    @relation("CategoryHierarchy", fields: [parentId], references: [id])
  subcategories Category[]  @relation("CategoryHierarchy")
  transactions Transaction[]
}

model Wallet {
  id          Int     @id @default(autoincrement())
  name        String
  type        String  // 'CHECKING', 'SAVINGS', 'CREDIT_CARD', 'CASH'
  balance     Float   @default(0)
  color       String  @default("#2196F3")
  icon        String  @default("account-balance-wallet")
  userId      Int
  isActive    Boolean @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
}

model Transaction {
  id          Int      @id @default(autoincrement())
  description String
  amount      Float
  type        String   // 'INCOME' ou 'EXPENSE'
  date        DateTime @default(now())
  userId      Int
  categoryId  Int
  walletId    Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id])
  wallet   Wallet   @relation(fields: [walletId], references: [id])
}
EOF

echo "✅ Configuração criada!"
echo

echo "📦 PASSO 5: Instalando dependências..."
echo

npm install

echo
echo "🔧 PASSO 6: Configurando Prisma..."
echo

npx prisma generate
npx prisma db push

echo
echo "🧪 PASSO 7: Testando..."
echo

npm run build

if [ $? -eq 0 ]; then
    echo "✅ Compilação bem-sucedida!"
    echo
    echo "🚀 PASSO 8: Iniciando backend..."
    echo
    
    npm run start:dev &
    sleep 5
    
    echo
    echo "🎉 RESET COMPLETO CONCLUÍDO!"
    echo "================================"
    echo
    echo "✅ PostgreSQL: localhost:5432"
    echo "✅ Backend: http://localhost:3000"
    echo "✅ Usuário: wimm_user"
    echo "✅ Senha: wimm_password"
    echo "✅ Banco: wimm_db"
    echo
    echo "📋 Próximos passos:"
    echo "1. Testar: http://localhost:3000"
    echo "2. Criar conta no app"
    echo "3. Testar funcionalidades"
    echo
    echo "🎯 Sistema limpo e funcional!"
    
else
    echo "❌ Erro na compilação"
    echo "🔍 Verifique os logs acima"
fi

echo
