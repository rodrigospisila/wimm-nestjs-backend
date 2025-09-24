import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
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
  color?: string = '#4CAF50';

  @IsOptional()
  @IsString()
  icon?: string = 'wallet';

  @IsOptional()
  @IsBoolean()
  hasIntegratedPix?: boolean = false;

  @IsOptional()
  @IsBoolean()
  hasWalletBalance?: boolean = false;
}
