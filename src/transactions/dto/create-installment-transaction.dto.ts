import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export enum InstallmentType {
  FIXED = 'FIXED',           // Parcelas fixas
  CREDIT_CARD = 'CREDIT_CARD', // Cartão de crédito
}

export class CreateInstallmentTransactionDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @Transform(({ value }) => parseFloat(value))
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @Max(60)
  @Transform(({ value }) => parseInt(value))
  installmentCount: number;

  @IsNotEmpty()
  @IsEnum(InstallmentType)
  installmentType: InstallmentType;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  walletId: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  creditCardId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  @Transform(({ value }) => parseInt(value))
  dueDay?: number; // Dia de vencimento para cartão de crédito
}
