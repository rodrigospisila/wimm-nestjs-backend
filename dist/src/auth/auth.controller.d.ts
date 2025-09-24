import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
        user: any;
    }>;
}
