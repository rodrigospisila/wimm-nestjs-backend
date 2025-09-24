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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Request() req, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(req.user.id, createCategoryDto);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('type') type?: string,
    @Query('hierarchical') hierarchical?: string,
  ) {
    if (hierarchical === 'true') {
      return this.categoriesService.findHierarchical(req.user.id, type);
    }
    return this.categoriesService.findAll(req.user.id, type);
  }

  @Get('statistics')
  getStatistics(
    @Request() req,
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
  ) {
    return this.categoriesService.getStatistics(req.user.id, categoryId);
  }

  @Post('default')
  createDefaultCategories(@Request() req) {
    return this.categoriesService.createDefaultCategories(req.user.id);
  }

  @Post('default/subcategories')
  createDefaultSubcategories(@Request() req) {
    return this.categoriesService.createDefaultSubcategories(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(req.user.id, id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(req.user.id, id);
  }
}
