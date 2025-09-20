import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ThemePreference } from '@prisma/client';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(ThemePreference)
  themePreference?: ThemePreference;
}
