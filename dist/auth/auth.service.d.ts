import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
        };
        token: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
        };
        token: string;
    }>;
}
