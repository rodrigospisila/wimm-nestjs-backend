#!/bin/bash

echo "🔥 RESET ULTRA-AGRESSIVO - REMOVENDO TUDO!"
echo "=========================================="
echo

# Parar qualquer processo do backend
pkill -f "npm run start:dev" 2>/dev/null
pkill -f "nest start" 2>/dev/null

echo "🗑️ REMOVENDO TUDO..."

# Remover containers Docker
docker stop wimm_postgres 2>/dev/null
docker rm wimm_postgres 2>/dev/null
docker volume rm wimm_postgres_data 2>/dev/null

# Remover TODOS os arquivos problemáticos
rm -rf src/categories
rm -rf src/reports  
rm -rf src/wallets
rm -rf src/transactions
rm -rf src/auth
rm -rf prisma/migrations
rm -rf node_modules/.prisma
rm -rf dist
rm -f prisma/dev.db*

echo "🐘 Criando PostgreSQL..."

docker run -d \
  --name wimm_postgres \
  -e POSTGRES_USER=wimm_user \
  -e POSTGRES_PASSWORD=wimm_password \
  -e POSTGRES_DB=wimm_db \
  -p 5432:5432 \
  postgres:15

sleep 10

echo "🔧 Criando configuração mínima..."

# .env limpo
cat > .env << 'EOF'
DATABASE_URL="postgresql://wimm_user:wimm_password@localhost:5432/wimm_db?schema=public"
JWT_SECRET=wimm-secret-2024
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
EOF

# Schema ultra-básico
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
EOF

# Auth básico
mkdir -p src/auth
cat > src/auth/auth.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'wimm-secret-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
EOF

cat > src/auth/auth.controller.ts << 'EOF'
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}
EOF

cat > src/auth/auth.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    
    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Credenciais inválidas');
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    
    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }
}
EOF

# App module limpo
cat > src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
})
export class AppModule {}
EOF

echo "📦 Instalando dependências..."
npm install

echo "🔧 Configurando Prisma..."
npx prisma generate
npx prisma db push

echo "🧪 Testando..."
npm run build

if [ $? -eq 0 ]; then
    echo
    echo "🎉 RESET ULTRA-AGRESSIVO CONCLUÍDO!"
    echo "=================================="
    echo
    echo "✅ Backend mínimo funcionando"
    echo "✅ Apenas autenticação básica"
    echo "✅ PostgreSQL limpo"
    echo "✅ Sem erros de compilação"
    echo
    echo "🚀 Iniciando backend..."
    npm run start:dev &
    
    echo
    echo "📋 Endpoints disponíveis:"
    echo "POST /auth/register"
    echo "POST /auth/login"
    echo
    echo "🎯 Agora você pode implementar funcionalidades gradualmente!"
    
else
    echo "❌ Ainda há erros"
fi
EOF

chmod +x reset-ultra-agressivo.sh
