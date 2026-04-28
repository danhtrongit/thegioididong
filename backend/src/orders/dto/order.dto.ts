import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested, IsInt, Min, IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { FulfillmentMethod, OrderStatus } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ description: 'ID SKU' })
  @IsString() @IsNotEmpty({ message: 'ID SKU không được để trống' })
  skuId: string;

  @ApiProperty({ description: 'Số lượng', example: 1 })
  @Type(() => Number) @IsInt() @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Họ tên khách hàng', example: 'Nguyễn Văn A' })
  @IsString() @IsNotEmpty({ message: 'Họ tên không được để trống' })
  customerName: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0901234567' })
  @IsString() @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  customerPhone: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional() @IsEmail({}, { message: 'Email không đúng định dạng' })
  customerEmail?: string;

  @ApiProperty({ description: 'Tỉnh/Thành phố', example: 'TP. Hồ Chí Minh' })
  @IsString() @IsNotEmpty({ message: 'Tỉnh/thành phố không được để trống' })
  province: string;

  @ApiProperty({ description: 'Quận/Huyện', example: 'Quận 1' })
  @IsString() @IsNotEmpty({ message: 'Quận/huyện không được để trống' })
  district: string;

  @ApiProperty({ description: 'Phường/Xã', example: 'Phường Bến Nghé' })
  @IsString() @IsNotEmpty({ message: 'Phường/xã không được để trống' })
  ward: string;

  @ApiProperty({ description: 'Địa chỉ cụ thể', example: '123 Nguyễn Huệ' })
  @IsString() @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  address: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional() @IsString()
  note?: string;

  @ApiPropertyOptional({ description: 'Phương thức nhận hàng', enum: FulfillmentMethod })
  @IsOptional() @IsEnum(FulfillmentMethod)
  fulfillmentMethod?: FulfillmentMethod;

  @ApiProperty({ description: 'Danh sách sản phẩm đặt mua', type: [OrderItemDto] })
  @IsArray({ message: 'Danh sách sản phẩm phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'Trạng thái mới', enum: OrderStatus })
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  status: OrderStatus;

  @ApiPropertyOptional({ description: 'Lý do (khi hủy đơn)' })
  @IsOptional() @IsString()
  reason?: string;
}

export class OrderNoteDto {
  @ApiProperty({ description: 'Ghi chú nội bộ' })
  @IsString() @IsNotEmpty({ message: 'Ghi chú không được để trống' })
  note: string;
}

export class OrderLookupDto {
  @ApiProperty({ description: 'Số điện thoại' })
  @IsString() @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({ description: 'Mã đơn hàng' })
  @IsString() @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
  orderCode: string;
}
