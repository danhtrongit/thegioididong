import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PagesService } from './pages.service.js';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Trang nội dung')
@Controller()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('pages/:slug')
  @ApiOperation({ summary: 'Chi tiết trang (công khai)', description: 'Xem trang nội dung đã xuất bản' })
  async findBySlug(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlugPublic(slug);
    return successResponse(page, 'Lấy trang thành công');
  }

  @Get('admin/pages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Danh sách trang (quản trị)' })
  async findAllAdmin(@Query() query: PaginationDto) {
    const { pages, total } = await this.pagesService.findAllAdmin(query.page, query.limit);
    return paginatedResponse(pages, total, query.page, query.limit, 'Lấy danh sách trang thành công');
  }

  @Post('admin/pages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo trang mới' })
  async create(@Body() dto: CreatePageDto, @CurrentUser('id') userId: string) {
    const page = await this.pagesService.create(dto, userId);
    return successResponse(page, 'Tạo trang thành công');
  }

  @Patch('admin/pages/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật trang' })
  async update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    const page = await this.pagesService.update(id, dto);
    return successResponse(page, 'Cập nhật trang thành công');
  }

  @Post('admin/pages/:id/preview')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Xem trước trang' })
  async preview(@Param('id') id: string) {
    const page = await this.pagesService.preview(id);
    return successResponse(page, 'Xem trước trang thành công');
  }
}
