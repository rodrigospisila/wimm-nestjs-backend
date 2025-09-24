<<<<<<< HEAD
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ThemePreference } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
=======
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
>>>>>>> e774a7dcb106e9741922850452d45128e6a0d2af

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
<<<<<<< HEAD
        themePreference: themePreference as ThemePreference,
      },
      select: {
        id: true,
        name: true,
        email: true,
        themePreference: true,
        biometricEnabled: true,
        notificationSettings: true,
        createdAt: true,
=======
>>>>>>> e774a7dcb106e9741922850452d45128e6a0d2af
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
