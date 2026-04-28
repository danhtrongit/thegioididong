import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto, UpdateOrderStatusDto, OrderNoteDto, OrderLookupDto } from './dto/order.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Đơn hàng')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==================== PUBLIC ====================

  @Post('orders')
  @ApiOperation({ summary: 'Đặt hàng (COD)', description: 'Tạo đơn hàng thanh toán khi nhận hàng' })
  async createOrder(@Body() dto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(dto);
    return successResponse(order, 'Đặt hàng thành công');
  }

  @Get('orders/lookup')
  @ApiOperation({ summary: 'Tra cứu đơn hàng', description: 'Tra cứu theo số điện thoại và mã đơn hàng' })
  async lookup(@Query() dto: OrderLookupDto) {
    const order = await this.ordersService.lookupOrder(dto.phone, dto.orderCode);
    return successResponse(order, 'Tra cứu đơn hàng thành công');
  }

  // ==================== ADMIN ====================

  @Get('admin/dashboard')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Tổng quan dashboard', description: 'Lấy dữ liệu tổng quan cho dashboard quản trị' })
  async dashboard() {
    const data = await this.ordersService.getDashboard();
    return successResponse(data, 'Lấy dữ liệu dashboard thành công');
  }

  @Get('admin/orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Danh sách đơn hàng (quản trị)' })
  async findAll(
    @Query() query: PaginationDto,
    @Query('status') status?: string,
    @Query('phone') phone?: string,
    @Query('orderCode') orderCode?: string,
  ) {
    const { orders, total } = await this.ordersService.findAllAdmin(
      query.page, query.limit, { status, phone, orderCode },
    );
    return paginatedResponse(orders, total, query.page, query.limit, 'Lấy danh sách đơn hàng thành công');
  }

  @Get('admin/orders/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Chi tiết đơn hàng' })
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOneAdmin(id);
    return successResponse(order, 'Lấy chi tiết đơn hàng thành công');
  }

  @Patch('admin/orders/:id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    const order = await this.ordersService.updateStatus(id, dto);
    return successResponse(order, 'Cập nhật trạng thái đơn hàng thành công');
  }

  @Post('admin/orders/:id/notes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Thêm ghi chú nội bộ' })
  async addNote(@Param('id') id: string, @Body() dto: OrderNoteDto) {
    const order = await this.ordersService.addNote(id, dto.note);
    return successResponse(order, 'Thêm ghi chú thành công');
  }
}
