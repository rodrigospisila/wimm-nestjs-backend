import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsInt()
  subcategoryId?: number;

  @IsInt()
  paymentMethodId: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  installmentId?: number;

  @IsOptional()
  @IsInt()
  installmentNumber?: number;
}
