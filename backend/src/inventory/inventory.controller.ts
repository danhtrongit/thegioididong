import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { InventoryService } from './inventory.service.js';
import { CreateInventoryMovementDto } from './dto/inventory.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Kho hàng')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('movements')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Tạo phiếu xuất/nhập kho', description: 'Điều chỉnh tồn kho cho SKU' })
  async createMovement(@Body() dto: CreateInventoryMovementDto, @CurrentUser('id') userId: string) {
    const movement = await this.inventoryService.createMovement(dto, userId);
    return successResponse(movement, 'Điều chỉnh tồn kho thành công');
  }

  @Get('movements')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Lịch sử xuất/nhập kho' })
  async getMovements(@Query('skuId') skuId: string, @Query() query: PaginationDto) {
    const { movements, total } = await this.inventoryService.getMovements(skuId, query.page, query.limit);
    return paginatedResponse(movements, total, query.page, query.limit, 'Lấy lịch sử kho thành công');
  }

  @Get('low-stock')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({ summary: 'Danh sách SKU sắp hết hàng' })
  async getLowStock() {
    const data = await this.inventoryService.getLowStock();
    return successResponse(data, 'Lấy danh sách hàng sắp hết thành công');
  }
}
