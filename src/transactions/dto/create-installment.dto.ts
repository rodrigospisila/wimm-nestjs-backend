import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';
import { InstallmentType } from '@prisma/client';

export class CreateInstallmentDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0.01)
  totalAmount: number;

  @IsInt()
  @Min(2)
  @Max(60)
  installmentCount: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsEnum(InstallmentType)
  installmentType: InstallmentType;

  @IsInt()
  categoryId: number;

  @IsInt()
  paymentMethodId: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
