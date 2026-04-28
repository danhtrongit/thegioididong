import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên danh mục', example: 'Điện thoại' })
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name: string;

  @ApiProperty({ description: 'Đường dẫn SEO', example: 'dien-thoai' })
  @IsString({ message: 'Slug phải là chuỗi' })
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @ApiPropertyOptional({ description: 'ID danh mục cha' })
  @IsOptional()
  @IsString({ message: 'ID danh mục cha phải là chuỗi' })
  parentId?: string;

  @ApiPropertyOptional({ description: 'ID ảnh đại diện' })
  @IsOptional()
  @IsString()
  imageMediaAssetId?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề SEO' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Mô tả SEO' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Thứ tự phải là số nguyên' })
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt', default: true })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là đúng/sai' })
  isActive?: boolean;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Tên danh mục' })
  @IsOptional()
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  name?: string;

  @ApiPropertyOptional({ description: 'Đường dẫn SEO' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'ID danh mục cha' })
  @IsOptional()
  @IsString()
  parentId?: string | null;

  @ApiPropertyOptional({ description: 'ID ảnh đại diện' })
  @IsOptional()
  @IsString()
  imageMediaAssetId?: string | null;

  @ApiPropertyOptional({ description: 'Tiêu đề SEO' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Mô tả SEO' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Thứ tự phải là số nguyên' })
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt' })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là đúng/sai' })
  isActive?: boolean;
}
