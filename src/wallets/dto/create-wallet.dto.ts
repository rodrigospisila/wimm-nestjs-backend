import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  initialBalance: number;
}
