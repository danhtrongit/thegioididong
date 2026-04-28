import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty({ description: 'ID SKU' })
  @IsString({ message: 'ID SKU phải là chuỗi' })
  @IsNotEmpty({ message: 'ID SKU không được để trống' })
  skuId: string;

  @ApiProperty({ description: 'Số lượng', example: 1 })
  @Type(() => Number)
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number;
}

export class ValidateCartDto {
  @ApiProperty({ description: 'Danh sách sản phẩm trong giỏ', type: [CartItemDto] })
  @IsArray({ message: 'Danh sách phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
