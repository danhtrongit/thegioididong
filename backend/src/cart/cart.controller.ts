import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service.js';
import { ValidateCartDto } from './dto/cart.dto.js';
import { successResponse } from '../common/helpers/response.helper.js';

@ApiTags('Giỏ hàng')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Xác thực giỏ hàng', description: 'Kiểm tra tồn kho, giá, trạng thái SKU trước khi thanh toán' })
  async validate(@Body() dto: ValidateCartDto) {
    const result = await this.cartService.validateCart(dto);
    return successResponse(result, 'Giỏ hàng hợp lệ');
  }
}
