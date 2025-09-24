@echo off
echo 🧹 Limpeza Completa e Reconstrução do Prisma

REM Parar todos os processos Node.js
echo 🛑 Parando processos Node.js...
taskkill /f /im node.exe 2>nul

REM Aguardar um pouco
timeout /t 2 /nobreak > nul

REM Remover TODOS os arquivos relacionados ao banco
echo 🗑️ Removendo arquivos do banco...
if exist "prisma\dev.db" del /f "prisma\dev.db"
if exist "prisma\dev.db-journal" del /f "prisma\dev.db-journal"
if exist "prisma\dev.db-shm" del /f "prisma\dev.db-shm"
if exist "prisma\dev.db-wal" del /f "prisma\dev.db-wal"

REM Remover migrações
echo 🗑️ Removendo migrações...
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"

REM Remover cache do Prisma
echo 🗑️ Removendo cache do Prisma...
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"
if exist "node_modules\@prisma\client" rmdir /s /q "node_modules\@prisma\client"

REM Limpar cache npm
echo 🧹 Limpando cache npm...
npm cache clean --force

REM Reinstalar Prisma
echo 📦 Reinstalando Prisma...
npm uninstall prisma @prisma/client
npm install prisma @prisma/client

REM Gerar cliente do zero
echo 🔧 Gerando cliente Prisma...
npx prisma generate

REM Criar schema manualmente (método alternativo)
echo 📊 Criando banco com schema simples...
npx prisma db push --accept-data-loss

REM Verificar resultado
if exist "prisma\dev.db" (
    echo ✅ Banco criado com sucesso!
    echo 🧪 Testando conexão...
    
    REM Testar se consegue conectar
    echo SELECT 'Teste de conexão' as resultado; | sqlite3 prisma\dev.db
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Conexão com banco funcionando!
        echo 🚀 Iniciando backend para teste...
        
        REM Iniciar backend em background para teste
        start /b npm run start:dev
        
        echo ⏳ Aguardando backend iniciar...
        timeout /t 8 /nobreak > nul
        
        echo ✅ Backend deve estar rodando!
        echo 🌐 Teste: http://localhost:3000
    ) else (
        echo ❌ Erro na conexão com banco
    )
) else (
    echo ❌ Erro ao criar banco
)

echo.
echo 🎉 Processo concluído!
echo 📋 Próximos passos:
echo 1. Verifique se o backend está rodando
echo 2. Acesse http://localhost:3000
echo 3. Se não funcionar, tente usar PostgreSQL
echo.
pause
