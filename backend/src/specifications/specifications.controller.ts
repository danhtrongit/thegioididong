import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SpecificationsService } from './specifications.service.js';
import { CreateSpecDefinitionDto } from './dto/specification.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { successResponse } from '../common/helpers/response.helper.js';

@ApiTags('Thông số kỹ thuật')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/specifications')
export class SpecificationsController {
  constructor(private readonly specificationsService: SpecificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách thông số theo danh mục' })
  async findByCategory(@Query('categoryId') categoryId: string) {
    const specs = await this.specificationsService.findByCategory(categoryId);
    return successResponse(specs, 'Lấy danh sách thông số thành công');
  }

  @Post()
  @ApiOperation({ summary: 'Tạo định nghĩa thông số mới' })
  async create(@Body() dto: CreateSpecDefinitionDto) {
    const spec = await this.specificationsService.create(dto);
    return successResponse(spec, 'Tạo thông số thành công');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật định nghĩa thông số' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateSpecDefinitionDto>) {
    const spec = await this.specificationsService.update(id, dto);
    return successResponse(spec, 'Cập nhật thông số thành công');
  }
}
