import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ProductsService } from './products.service.js';
import {
  CreateProductDto, UpdateProductDto, CreateProductImagesDto,
  CreateSKUDto, UpdateSKUDto, CreateProductSpecificationsDto, ProductQueryDto,
} from './dto/product.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Sản phẩm')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Danh sách sản phẩm (công khai)', description: 'Lấy sản phẩm đã xuất bản, hỗ trợ lọc, sắp xếp, phân trang' })
  async findAllPublic(@Query() query: ProductQueryDto) {
    const { products, total, page, limit } = await this.productsService.findAllPublic(query);
    return paginatedResponse(products, total, page, limit, 'Lấy danh sách sản phẩm thành công');
  }

  @Get('products/compare')
  @ApiOperation({ summary: 'So sánh sản phẩm', description: 'So sánh tối đa 3 sản phẩm theo slug' })
  async compare(@Query('slugs') slugs: string) {
    const slugList = slugs ? slugs.split(',').slice(0, 3) : [];
    const products = await this.productsService.compareProducts(slugList);
    return successResponse(products, 'Lấy dữ liệu so sánh thành công');
  }

  @Get('products/:slug')
  @ApiOperation({ summary: 'Chi tiết sản phẩm (công khai)', description: 'Lấy chi tiết sản phẩm theo slug' })
  async findBySlug(@Param('slug') slug: string) {
    const product = await this.productsService.findBySlugPublic(slug);
    return successResponse(product, 'Lấy chi tiết sản phẩm thành công');
  }

  @Get('search/suggestions')
  @ApiOperation({ summary: 'Gợi ý tìm kiếm', description: 'Gợi ý sản phẩm khi gõ tìm kiếm' })
  async suggestions(@Query('q') q: string) {
    const data = await this.productsService.searchSuggestions(q);
    return successResponse(data, 'Lấy gợi ý thành công');
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm', description: 'Tìm kiếm sản phẩm theo từ khóa' })
  async search(@Query() query: ProductQueryDto) {
    const { products, total, page, limit } = await this.productsService.findAllPublic(query);
    return paginatedResponse(products, total, page, limit, 'Tìm kiếm thành công');
  }

  // ==================== ADMIN ====================

  @Get('admin/products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Danh sách sản phẩm (quản trị)' })
  async findAllAdmin(@Query() query: PaginationDto) {
    const { products, total } = await this.productsService.findAllAdmin(query.page, query.limit);
    return paginatedResponse(products, total, query.page, query.limit, 'Lấy danh sách sản phẩm thành công');
  }

  @Post('admin/products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo sản phẩm', description: 'Tạo sản phẩm mới' })
  async create(@Body() dto: CreateProductDto) {
    const product = await this.productsService.create(dto);
    return successResponse(product, 'Tạo sản phẩm thành công');
  }

  @Patch('admin/products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.productsService.update(id, dto);
    return successResponse(product, 'Cập nhật sản phẩm thành công');
  }

  @Post('admin/products/:id/images')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Thêm ảnh sản phẩm' })
  async addImages(@Param('id') id: string, @Body() dto: CreateProductImagesDto) {
    await this.productsService.addImages(id, dto);
    return successResponse(null, 'Thêm ảnh sản phẩm thành công');
  }

  @Post('admin/products/:id/specifications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Thêm/cập nhật thông số kỹ thuật' })
  async addSpecs(@Param('id') id: string, @Body() dto: CreateProductSpecificationsDto) {
    const specs = await this.productsService.addSpecifications(id, dto);
    return successResponse(specs, 'Cập nhật thông số kỹ thuật thành công');
  }

  @Post('admin/products/:id/skus')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo SKU cho sản phẩm' })
  async createSku(@Param('id') id: string, @Body() dto: CreateSKUDto) {
    const sku = await this.productsService.createSKU(id, dto);
    return successResponse(sku, 'Tạo SKU thành công');
  }

  @Patch('admin/skus/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật SKU' })
  async updateSku(@Param('id') id: string, @Body() dto: UpdateSKUDto) {
    const sku = await this.productsService.updateSKU(id, dto);
    return successResponse(sku, 'Cập nhật SKU thành công');
  }
}
