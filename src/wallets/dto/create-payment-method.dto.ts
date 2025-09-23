import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { PaymentMethodType } from '@prisma/client';

export class CreatePaymentMethodDto {
  @IsString()
  name: string;

  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @IsOptional()
  @IsNumber()
  currentBalance?: number;

  // Campos específicos para cartão de crédito
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(28)
  closingDay?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  dueDay?: number;

  // Campos específicos para contas bancárias
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  agency?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  // Configurações gerais
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  walletGroupId?: number;
}
