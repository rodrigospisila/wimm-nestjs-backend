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
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Request() req, @Query('type') type?: string) {
    const userId = req.user.userId;
    return this.categoriesService.findAllByUser(userId, type);
  }

  @Get('hierarchy')
  async getHierarchy(@Request() req, @Query('type') type?: string) {
    const userId = req.user.userId;
    return this.categoriesService.getHierarchy(userId, type);
  }

  @Get('types')
  async getTypes() {
    return this.categoriesService.getTypes();
  }

  @Post('create-defaults')
  async createDefaults(@Request() req) {
    const userId = req.user.userId;
    return this.categoriesService.createDefaults(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.categoriesService.findOne(userId, id);
  }

  @Post()
  async create(@Request() req, @Body() createCategoryDto: CreateCategoryDto) {
    const userId = req.user.userId;
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const userId = req.user.userId;
    return this.categoriesService.update(userId, id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.categoriesService.remove(userId, id);
  }

  @Get(':id/subcategories')
  async getSubcategories(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user.userId;
    return this.categoriesService.getSubcategories(userId, id);
  }

  @Get(':id/statistics')
  async getCategoryStatistics(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userId = req.user.userId;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.categoriesService.getCategoryStatistics(userId, id, start, end);
  }
}
