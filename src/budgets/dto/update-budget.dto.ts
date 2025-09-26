import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetDto } from './create-budget.dto';
import { IsOptional, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @IsOptional()
  @IsNumber({}, { message: 'Limite mensal deve ser um número' })
  @IsPositive({ message: 'Limite mensal deve ser positivo' })
  @Type(() => Number)
  monthlyLimit?: number;
}
