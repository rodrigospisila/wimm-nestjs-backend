import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Request() req, @Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(req.user.id, createWalletDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.walletsService.findAll(req.user.id);
  }

  @Get('summary')
  getSummary(@Request() req) {
    return this.walletsService.getSummary(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.walletsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletsService.update(id, req.user.id, updateWalletDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.walletsService.remove(id, req.user.id);
  }
}
