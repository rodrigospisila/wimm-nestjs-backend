import { IsString, IsEnum, IsOptional, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  type: string;

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
