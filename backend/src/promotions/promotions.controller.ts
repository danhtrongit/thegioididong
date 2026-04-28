import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PromotionsService } from './promotions.service.js';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Khuyến mãi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách khuyến mãi' })
  async findAll(@Query() query: PaginationDto) {
    const { promotions, total } = await this.promotionsService.findAll(query.page, query.limit);
    return paginatedResponse(promotions, total, query.page, query.limit, 'Lấy danh sách khuyến mãi thành công');
  }

  @Post()
  @ApiOperation({ summary: 'Tạo khuyến mãi', description: 'Tạo chương trình khuyến mãi mới' })
  async create(@Body() dto: CreatePromotionDto) {
    const promo = await this.promotionsService.create(dto);
    return successResponse(promo, 'Tạo khuyến mãi thành công');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật khuyến mãi' })
  async update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    const promo = await this.promotionsService.update(id, dto);
    return successResponse(promo, 'Cập nhật khuyến mãi thành công');
  }
}
