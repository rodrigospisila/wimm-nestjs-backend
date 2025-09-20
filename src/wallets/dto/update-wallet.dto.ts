import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateWalletDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  currentBalance?: number;
}
