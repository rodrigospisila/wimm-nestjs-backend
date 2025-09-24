@echo off
echo 🔧 Corrigindo migrações do Prisma no Windows...

REM Parar qualquer processo que possa estar usando o banco
echo 📋 Limpando arquivos antigos...

REM Remover banco antigo se existir
if exist "prisma\dev.db" (
    echo 🗑️ Removendo banco antigo...
    del "prisma\dev.db"
)

REM Remover diretório de migrações antigas
if exist "prisma\migrations" (
    echo 🗑️ Removendo migrações antigas...
    rmdir /s /q "prisma\migrations"
)

REM Gerar cliente Prisma
echo 🔧 Gerando cliente Prisma...
npx prisma generate

REM Criar nova migração inicial
echo 📊 Criando nova migração...
npx prisma migrate dev --name init_windows

REM Verificar se funcionou
if exist "prisma\dev.db" (
    echo ✅ Banco de dados criado com sucesso!
    echo ✅ Migrações aplicadas!
    echo 🚀 Backend pronto para iniciar!
) else (
    echo ❌ Erro ao criar banco. Tentando método alternativo...
    echo 🔧 Usando db push...
    npx prisma db push
)

echo 🎉 Correção concluída!
echo 🚀 Agora execute: npm run start:dev
pause
