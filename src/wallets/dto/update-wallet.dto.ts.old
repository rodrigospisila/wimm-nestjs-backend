import { IsString, IsNumber, IsOptional, IsEnum, IsHexColor, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { WalletType } from '@prisma/client';

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Saldo atual deve ser um número' })
  currentBalance?: number;

  @IsOptional()
  @IsEnum(WalletType, { message: 'Tipo de carteira inválido' })
  type?: WalletType;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Descrição deve ter no máximo 200 caracteres' })
  description?: string;

  @IsOptional()
  @IsString()
  @IsHexColor({ message: 'Cor deve estar no formato hexadecimal (#RRGGBB)' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Ícone deve ter no máximo 30 caracteres' })
  icon?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
