import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBudgetDto {
  @IsNotEmpty({ message: 'ID da categoria é obrigatório' })
  @IsNumber({}, { message: 'ID da categoria deve ser um número' })
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @IsNumber({}, { message: 'ID da subcategoria deve ser um número' })
  @Type(() => Number)
  subcategoryId?: number;

  @IsNotEmpty({ message: 'Limite mensal é obrigatório' })
  @IsNumber({}, { message: 'Limite mensal deve ser um número' })
  @IsPositive({ message: 'Limite mensal deve ser positivo' })
  @Type(() => Number)
  monthlyLimit: number;

  @IsNotEmpty({ message: 'Mês é obrigatório' })
  @IsNumber({}, { message: 'Mês deve ser um número' })
  @Min(1, { message: 'Mês deve ser entre 1 e 12' })
  @Max(12, { message: 'Mês deve ser entre 1 e 12' })
  @Type(() => Number)
  month: number;

  @IsNotEmpty({ message: 'Ano é obrigatório' })
  @IsNumber({}, { message: 'Ano deve ser um número' })
  @Min(2020, { message: 'Ano deve ser maior que 2020' })
  @Max(2030, { message: 'Ano deve ser menor que 2030' })
  @Type(() => Number)
  year: number;
}
