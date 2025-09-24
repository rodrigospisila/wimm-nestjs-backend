import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { PaymentMethodType } from '@prisma/client';

export class CreatePaymentMethodDto {
  @IsString()
  name: string;

  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @IsOptional()
  @IsNumber()
  currentBalance?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(28)
  closingDay?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDay?: number;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  agency?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;

  @IsOptional()
  @IsString()
  color?: string = '#4CAF50';

  @IsOptional()
  @IsString()
  icon?: string = 'credit-card';

  @IsOptional()
  @IsInt()
  walletGroupId?: number;
}
