@echo off
echo 🔥 VERSAO FINAL ULTRA-SIMPLES
echo ============================

echo 🗑️ Limpando tudo...
if exist "src\auth" rmdir /s /q "src\auth"
if exist "src\categories" rmdir /s /q "src\categories"
if exist "src\reports" rmdir /s /q "src\reports"
if exist "src\wallets" rmdir /s /q "src\wallets"
if exist "src\transactions" rmdir /s /q "src\transactions"
if exist "prisma\migrations" rmdir /s /q "prisma\migrations"
if exist "prisma\dev.db" del "prisma\dev.db"
if exist "dist" rmdir /s /q "dist"

echo 🔧 Criando configuracao minima...

REM .env para SQLite
(
echo DATABASE_URL="file:./dev.db"
echo JWT_SECRET=wimm-secret-2024
echo PORT=3000
echo NODE_ENV=development
) > ".env"

REM Schema ultra-basico
(
echo generator client {
echo   provider = "prisma-client-js"
echo }
echo.
echo datasource db {
echo   provider = "sqlite"
echo   url      = env("DATABASE_URL"^)
echo }
echo.
echo model User {
echo   id        Int      @id @default(autoincrement(^)^)
echo   name      String
echo   email     String   @unique
echo   password  String
echo   createdAt DateTime @default(now(^)^)
echo   updatedAt DateTime @updatedAt
echo }
) > "prisma\schema.prisma"

REM Auth sem bcrypt
mkdir src\auth
(
echo import { Module } from '@nestjs/common';
echo import { AuthController } from './auth.controller';
echo import { AuthService } from './auth.service';
echo import { PrismaModule } from '../prisma/prisma.module';
echo.
echo @Module({
echo   imports: [PrismaModule],
echo   controllers: [AuthController],
echo   providers: [AuthService],
echo }^)
echo export class AuthModule {}
) > "src\auth\auth.module.ts"

(
echo import { Controller, Post, Body, Get } from '@nestjs/common';
echo import { AuthService } from './auth.service';
echo.
echo @Controller('auth'^)
echo export class AuthController {
echo   constructor(private authService: AuthService^) {}
echo.
echo   @Get('test'^)
echo   test(^) {
echo     return { message: 'Auth funcionando!' };
echo   }
echo.
echo   @Post('register'^)
echo   async register(@Body(^) body: { name: string; email: string; password: string }^) {
echo     return this.authService.register(body^);
echo   }
echo.
echo   @Post('login'^)
echo   async login(@Body(^) body: { email: string; password: string }^) {
echo     return this.authService.login(body^);
echo   }
echo }
) > "src\auth\auth.controller.ts"

(
echo import { Injectable } from '@nestjs/common';
echo import { PrismaService } from '../prisma/prisma.service';
echo.
echo @Injectable(^)
echo export class AuthService {
echo   constructor(private prisma: PrismaService^) {}
echo.
echo   async register(data: { name: string; email: string; password: string }^) {
echo     const user = await this.prisma.user.create({
echo       data: {
echo         name: data.name,
echo         email: data.email,
echo         password: data.password, // Sem hash por simplicidade
echo       },
echo     }^);
echo.
echo     return {
echo       user: { id: user.id, name: user.name, email: user.email },
echo       token: 'fake-token-' + user.id,
echo     };
echo   }
echo.
echo   async login(data: { email: string; password: string }^) {
echo     const user = await this.prisma.user.findUnique({
echo       where: { email: data.email },
echo     }^);
echo.
echo     if (!user ^|^| user.password !== data.password^) {
echo       throw new Error('Credenciais invalidas'^);
echo     }
echo.
echo     return {
echo       user: { id: user.id, name: user.name, email: user.email },
echo       token: 'fake-token-' + user.id,
echo     };
echo   }
echo }
) > "src\auth\auth.service.ts"

REM App module
(
echo import { Module } from '@nestjs/common';
echo import { PrismaModule } from './prisma/prisma.module';
echo import { AuthModule } from './auth/auth.module';
echo.
echo @Module({
echo   imports: [PrismaModule, AuthModule],
echo }^)
echo export class AppModule {}
) > "src\app.module.ts"

echo 📦 Gerando Prisma...
npx prisma generate

echo 🗄️ Criando banco...
npx prisma db push

echo 🧪 Testando compilacao...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 SUCESSO! Backend funcionando!
    echo ================================
    echo.
    echo ✅ SQLite: ./dev.db
    echo ✅ Backend: http://localhost:3000
    echo ✅ Endpoints: /auth/test, /auth/register, /auth/login
    echo.
    echo 🚀 Iniciando backend...
    start /b npm run start:dev
    timeout /t 3 /nobreak > nul
    echo.
    echo 🎯 Teste: http://localhost:3000/auth/test
    
) else (
    echo ❌ Erro na compilacao
)

pause
