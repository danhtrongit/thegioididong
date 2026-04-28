import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ArticlesService } from './articles.service.js';
import { CreateArticleCategoryDto, CreateArticleTagDto, CreateArticleDto } from './dto/article.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Bài viết')
@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // ==================== PUBLIC ====================
  @Get('article-categories')
  @ApiOperation({ summary: 'Danh mục bài viết (công khai)' })
  async publicCategories() {
    const categories = await this.articlesService.findCategoriesPublic();
    return successResponse(categories, 'Lấy danh mục bài viết thành công');
  }

  @Get('articles')
  @ApiOperation({ summary: 'Danh sách bài viết (công khai)', description: 'Lấy bài viết đã xuất bản, lọc theo danh mục' })
  async findAllPublic(@Query() query: PaginationDto, @Query('category') category?: string) {
    const { articles, total } = await this.articlesService.findAllPublic(query.page, query.limit, category);
    return paginatedResponse(articles, total, query.page, query.limit, 'Lấy danh sách bài viết thành công');
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Chi tiết bài viết (công khai)' })
  async findBySlug(@Param('slug') slug: string) {
    const article = await this.articlesService.findBySlugPublic(slug);
    return successResponse(article, 'Lấy bài viết thành công');
  }

  // ==================== ADMIN ====================
  @Get('admin/article-categories')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Danh mục bài viết (quản trị)' })
  async adminCategories() {
    const categories = await this.articlesService.findCategoriesAdmin();
    return successResponse(categories, 'Lấy danh mục bài viết thành công');
  }

  @Post('admin/article-categories')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo danh mục bài viết' })
  async createCategory(@Body() dto: CreateArticleCategoryDto) {
    const cat = await this.articlesService.createCategory(dto);
    return successResponse(cat, 'Tạo danh mục bài viết thành công');
  }

  @Patch('admin/article-categories/:id')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục bài viết' })
  async updateCategory(@Param('id') id: string, @Body() dto: Partial<CreateArticleCategoryDto>) {
    const cat = await this.articlesService.updateCategory(id, dto);
    return successResponse(cat, 'Cập nhật danh mục bài viết thành công');
  }

  @Get('admin/article-tags')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Danh sách tag bài viết' })
  async adminTags() {
    const tags = await this.articlesService.findTagsAdmin();
    return successResponse(tags, 'Lấy danh sách tag thành công');
  }

  @Post('admin/article-tags')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo tag bài viết' })
  async createTag(@Body() dto: CreateArticleTagDto) {
    const tag = await this.articlesService.createTag(dto);
    return successResponse(tag, 'Tạo tag thành công');
  }

  @Patch('admin/article-tags/:id')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật tag bài viết' })
  async updateTag(@Param('id') id: string, @Body() dto: Partial<CreateArticleTagDto>) {
    const tag = await this.articlesService.updateTag(id, dto);
    return successResponse(tag, 'Cập nhật tag thành công');
  }

  @Get('admin/articles')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Danh sách bài viết (quản trị)' })
  async findAllAdmin(@Query() query: PaginationDto) {
    const { articles, total } = await this.articlesService.findAllAdmin(query.page, query.limit);
    return paginatedResponse(articles, total, query.page, query.limit, 'Lấy danh sách bài viết thành công');
  }

  @Post('admin/articles')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo bài viết' })
  async create(@Body() dto: CreateArticleDto, @CurrentUser('id') userId: string) {
    const article = await this.articlesService.create(dto, userId);
    return successResponse(article, 'Tạo bài viết thành công');
  }

  @Patch('admin/articles/:id')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật bài viết' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateArticleDto>) {
    const article = await this.articlesService.update(id, dto);
    return successResponse(article, 'Cập nhật bài viết thành công');
  }

  @Post('admin/articles/:id/preview')
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Xem trước bài viết' })
  async preview(@Param('id') id: string) {
    const article = await this.articlesService.preview(id);
    return successResponse(article, 'Xem trước bài viết thành công');
  }
}
