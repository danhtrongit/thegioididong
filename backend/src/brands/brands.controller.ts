import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { BrandsService } from './brands.service.js';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { successResponse } from '../common/helpers/response.helper.js';

@ApiTags('Thương hiệu')
@Controller()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get('brands')
  @ApiOperation({ summary: 'Danh sách thương hiệu (công khai)', description: 'Lấy tất cả thương hiệu đang hoạt động' })
  async findAllPublic() {
    const brands = await this.brandsService.findAllPublic();
    return successResponse(brands, 'Lấy danh sách thương hiệu thành công');
  }

  @Get('admin/brands')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Danh sách thương hiệu (quản trị)' })
  async findAllAdmin() {
    const brands = await this.brandsService.findAllAdmin();
    return successResponse(brands, 'Lấy danh sách thương hiệu thành công');
  }

  @Post('admin/brands')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo thương hiệu', description: 'Tạo thương hiệu mới' })
  async create(@Body() dto: CreateBrandDto) {
    const brand = await this.brandsService.create(dto);
    return successResponse(brand, 'Tạo thương hiệu thành công');
  }

  @Patch('admin/brands/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thương hiệu' })
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    const brand = await this.brandsService.update(id, dto);
    return successResponse(brand, 'Cập nhật thương hiệu thành công');
  }

  @Delete('admin/brands/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa thương hiệu' })
  async delete(@Param('id') id: string) {
    await this.brandsService.delete(id);
    return successResponse(null, 'Xóa thương hiệu thành công');
  }
}
