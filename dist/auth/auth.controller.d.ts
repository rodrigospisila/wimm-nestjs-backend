import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            name: string;
            email: string;
            themePreference: import("generated/prisma").$Enums.ThemePreference;
            id: number;
            biometricEnabled: boolean;
            notificationSettings: import("generated/prisma/runtime/library").JsonValue;
            createdAt: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            themePreference: import("generated/prisma").$Enums.ThemePreference;
            biometricEnabled: boolean;
            notificationSettings: import("generated/prisma/runtime/library").JsonValue;
            createdAt: Date;
        };
    }>;
    getProfile(req: any): Promise<{
        user: any;
    }>;
}
