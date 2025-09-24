import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            createdAt: Date;
            id: number;
            name: string;
            email: string;
            password: string;
            themePreference: import("@prisma/client").$Enums.ThemePreference;
            biometricEnabled: boolean;
            pinCode: string | null;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            updatedAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            themePreference: import("@prisma/client").$Enums.ThemePreference;
            biometricEnabled: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
        };
    }>;
    validateUser(userId: number): Promise<{
        createdAt: Date;
        id: number;
        name: string;
        email: string;
        themePreference: import("@prisma/client").$Enums.ThemePreference;
        biometricEnabled: boolean;
        notificationSettings: import("@prisma/client/runtime/library").JsonValue;
    } | null>;
}
