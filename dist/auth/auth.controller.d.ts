import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
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
    login(body: {
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
