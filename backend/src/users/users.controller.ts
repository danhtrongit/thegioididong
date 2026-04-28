import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Người dùng')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng', description: 'Lấy danh sách tất cả người dùng, phân trang' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async findAll(@Query() query: PaginationDto) {
    const { users, total } = await this.usersService.findAll(query.page, query.limit);
    return paginatedResponse(users, total, query.page, query.limit, 'Lấy danh sách người dùng thành công');
  }

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng', description: 'Tạo tài khoản nhân viên hoặc quản trị viên mới' })
  @ApiResponse({ status: 201, description: 'Tạo người dùng thành công' })
  @ApiResponse({ status: 409, description: 'Email đã được sử dụng' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return successResponse(user, 'Tạo người dùng thành công');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng', description: 'Cập nhật thông tin người dùng, đổi vai trò hoặc đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Cập nhật người dùng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(id, dto);
    return successResponse(user, 'Cập nhật người dùng thành công');
  }
}
