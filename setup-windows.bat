@echo off
echo 🚀 Configurando Wimm Backend para Windows...

REM Copiar arquivo .env para Windows
copy .env.windows .env

REM Instalar dependências
echo 📦 Instalando dependências...
npm install

REM Gerar cliente Prisma
echo 🔧 Gerando cliente Prisma...
npx prisma generate

REM Aplicar migrações
echo 📊 Aplicando migrações do banco...
npx prisma migrate deploy

REM Verificar se o banco foi criado
if exist "prisma\dev.db" (
    echo ✅ Banco de dados criado com sucesso!
) else (
    echo ❌ Erro ao criar banco de dados
    echo 🔧 Tentando criar manualmente...
    npx prisma db push
)

echo 🎉 Configuração concluída!
echo 🚀 Para iniciar o backend, execute: npm run start:dev
pause
