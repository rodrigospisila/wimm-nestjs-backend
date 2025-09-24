import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class CreateWalletGroupDto {
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
  @IsBoolean()
  hasIntegratedPix?: boolean;

  @IsOptional()
  @IsBoolean()
  hasWalletBalance?: boolean;
}
