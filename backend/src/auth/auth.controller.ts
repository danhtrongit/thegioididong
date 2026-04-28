import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto.js';
import { successResponse } from '../common/helpers/response.helper.js';

@ApiTags('Xác thực')
@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập quản trị', description: 'Đăng nhập bằng email và mật khẩu để nhận access token và refresh token' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không đúng' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return successResponse(result, 'Đăng nhập thành công');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới token', description: 'Dùng refresh token để lấy access token mới' })
  @ApiResponse({ status: 200, description: 'Làm mới token thành công' })
  @ApiResponse({ status: 401, description: 'Refresh token không hợp lệ' })
  async refresh(@Body() dto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(dto);
    return successResponse(result, 'Làm mới token thành công');
  }
}
