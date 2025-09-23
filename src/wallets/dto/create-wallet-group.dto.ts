import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { WalletGroupType } from '@prisma/client';

export class CreateWalletGroupDto {
  @IsString()
  name: string;

  @IsEnum(WalletGroupType)
  type: WalletGroupType;

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
