import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsNumber, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from '@prisma/client';

export class CreatePromotionDto {
  @ApiProperty({ description: 'Tiêu đề khuyến mãi', example: 'Giảm giá iPhone 16' })
  @IsString() @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ description: 'Loại giảm giá', enum: DiscountType })
  @IsEnum(DiscountType, { message: 'Loại giảm giá không hợp lệ' })
  discountType: DiscountType;

  @ApiProperty({ description: 'Giá trị giảm', example: 10 })
  @IsNumber({}, { message: 'Giá trị giảm phải là số' })
  discountValue: number;

  @ApiProperty({ description: 'Ngày bắt đầu' })
  @IsDateString({}, { message: 'Ngày bắt đầu không đúng định dạng' })
  startsAt: string;

  @ApiProperty({ description: 'Ngày kết thúc' })
  @IsDateString({}, { message: 'Ngày kết thúc không đúng định dạng' })
  endsAt: string;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt' })
  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Danh sách ID sản phẩm áp dụng' })
  @IsOptional() @IsArray()
  productIds?: string[];

  @ApiPropertyOptional({ description: 'Danh sách ID SKU áp dụng' })
  @IsOptional() @IsArray()
  skuIds?: string[];
}

export class UpdatePromotionDto {
  @ApiPropertyOptional({ description: 'Tiêu đề' })
  @IsOptional() @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Loại giảm giá', enum: DiscountType })
  @IsOptional() @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiPropertyOptional({ description: 'Giá trị giảm' })
  @IsOptional() @IsNumber()
  discountValue?: number;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu' })
  @IsOptional() @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({ description: 'Ngày kết thúc' })
  @IsOptional() @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt' })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}
