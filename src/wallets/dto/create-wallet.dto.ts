import { IsString, IsNumber, IsOptional, IsEnum, IsHexColor, MinLength, MaxLength } from 'class-validator';
import { WalletType } from '@prisma/client';

export class CreateWalletDto {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name: string;

  @IsNumber({}, { message: 'Saldo inicial deve ser um número' })
  @IsOptional()
  initialBalance?: number;

  @IsEnum(WalletType, { message: 'Tipo de carteira inválido' })
  @IsOptional()
  type?: WalletType;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Descrição deve ter no máximo 200 caracteres' })
  description?: string;

  @IsString()
  @IsOptional()
  @IsHexColor({ message: 'Cor deve estar no formato hexadecimal (#RRGGBB)' })
  color?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'Ícone deve ter no máximo 30 caracteres' })
  icon?: string;
}
