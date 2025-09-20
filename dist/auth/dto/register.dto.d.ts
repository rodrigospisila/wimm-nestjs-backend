import { ThemePreference } from '../../../generated/prisma';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    themePreference?: ThemePreference;
}
