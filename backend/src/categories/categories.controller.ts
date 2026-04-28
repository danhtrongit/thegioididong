import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { successResponse } from '../common/helpers/response.helper.js';

@ApiTags('Danh mục')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ==================== PUBLIC ====================

  @Get('categories')
  @ApiOperation({ summary: 'Danh sách danh mục (công khai)', description: 'Lấy tất cả danh mục đang hoạt động' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách danh mục thành công' })
  async findAllPublic() {
    const categories = await this.categoriesService.findAllPublic();
    return successResponse(categories, 'Lấy danh sách danh mục thành công');
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Chi tiết danh mục (công khai)', description: 'Lấy chi tiết danh mục theo slug' })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết danh mục thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy danh mục' })
  async findBySlug(@Param('slug') slug: string) {
    const category = await this.categoriesService.findBySlugPublic(slug);
    return successResponse(category, 'Lấy chi tiết danh mục thành công');
  }

  // ==================== ADMIN ====================

  @Get('admin/categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Danh sách danh mục (quản trị)', description: 'Lấy tất cả danh mục bao gồm cả không hoạt động' })
  async findAllAdmin() {
    const categories = await this.categoriesService.findAllAdmin();
    return successResponse(categories, 'Lấy danh sách danh mục thành công');
  }

  @Post('admin/categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo danh mục', description: 'Tạo danh mục sản phẩm mới' })
  @ApiResponse({ status: 201, description: 'Tạo danh mục thành công' })
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    return successResponse(category, 'Tạo danh mục thành công');
  }

  @Patch('admin/categories/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục', description: 'Cập nhật thông tin danh mục' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, dto);
    return successResponse(category, 'Cập nhật danh mục thành công');
  }

  @Delete('admin/categories/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa danh mục', description: 'Xóa danh mục nếu không có sản phẩm hoặc danh mục con' })
  async delete(@Param('id') id: string) {
    await this.categoriesService.delete(id);
    return successResponse(null, 'Xóa danh mục thành công');
  }
}
