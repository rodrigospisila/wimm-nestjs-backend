import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
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
    login(body: {
        email: string;
        password: string;
    }): Promise<{
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
    getMe(req: any): Promise<{
        user: {
            name: string;
            email: string;
            themePreference: import("@prisma/client").$Enums.ThemePreference;
            id: number;
            biometricEnabled: boolean;
            notificationSettings: import("@prisma/client/runtime/library").JsonValue;
            createdAt: Date;
        };
    }>;
}
