import { IsString, IsEnum, IsOptional, IsNumber, IsPositive, IsInt } from 'class-validator';
import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(CategoryType)
  type: CategoryType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  monthlyBudget?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  parentCategoryId?: number;
}
