import {
  IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested,
  IsNumber, IsBoolean, IsInt, Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ description: 'ID danh mục' })
  @IsString({ message: 'ID danh mục phải là chuỗi' })
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  categoryId: string;

  @ApiProperty({ description: 'ID thương hiệu' })
  @IsString({ message: 'ID thương hiệu phải là chuỗi' })
  @IsNotEmpty({ message: 'Thương hiệu không được để trống' })
  brandId: string;

  @ApiProperty({ description: 'Tên sản phẩm', example: 'iPhone 16 Pro Max' })
  @IsString({ message: 'Tên sản phẩm phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @ApiProperty({ description: 'Đường dẫn SEO', example: 'iphone-16-pro-max' })
  @IsString({ message: 'Slug phải là chuỗi' })
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề SEO' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Mô tả SEO' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'Trạng thái sản phẩm', enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Trạng thái không hợp lệ. Chọn: DRAFT, PUBLISHED, ARCHIVED' })
  status?: ProductStatus;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'ID danh mục' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'ID thương hiệu' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Tên sản phẩm' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Đường dẫn SEO' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Mô tả ngắn' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề SEO' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Mô tả SEO' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Trạng thái không hợp lệ' })
  status?: ProductStatus;
}

export class ProductImageDto {
  @ApiProperty({ description: 'ID media asset' })
  @IsString({ message: 'ID media phải là chuỗi' })
  @IsNotEmpty({ message: 'ID media không được để trống' })
  mediaAssetId: string;

  @ApiPropertyOptional({ description: 'ID SKU (nếu ảnh riêng cho SKU)' })
  @IsOptional()
  @IsString()
  skuId?: string;

  @ApiPropertyOptional({ description: 'Alt text cho ảnh' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Thứ tự hiển thị' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class CreateProductImagesDto {
  @ApiProperty({ description: 'Danh sách ảnh sản phẩm', type: [ProductImageDto] })
  @IsArray({ message: 'Danh sách ảnh phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];
}

export class VariantAttributeDto {
  @ApiProperty({ description: 'Tên thuộc tính', example: 'color' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Giá trị', example: 'Titan Xanh' })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateSKUDto {
  @ApiProperty({ description: 'Mã SKU', example: 'IP16PM-256-XANH' })
  @IsString({ message: 'Mã SKU phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã SKU không được để trống' })
  skuCode: string;

  @ApiPropertyOptional({ description: 'Mã vạch' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ description: 'Tên biến thể', example: 'iPhone 16 Pro Max 256GB Titan Xanh' })
  @IsString({ message: 'Tên SKU phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên SKU không được để trống' })
  name: string;

  @ApiProperty({ description: 'Giá bán', example: 34990000 })
  @IsNumber({}, { message: 'Giá bán phải là số' })
  @Min(0, { message: 'Giá bán không được âm' })
  price: number;

  @ApiPropertyOptional({ description: 'Giá cũ', example: 36990000 })
  @IsOptional()
  @IsNumber({}, { message: 'Giá cũ phải là số' })
  oldPrice?: number;

  @ApiPropertyOptional({ description: 'Giá vốn' })
  @IsOptional()
  @IsNumber({}, { message: 'Giá vốn phải là số' })
  costPrice?: number;

  @ApiPropertyOptional({ description: 'Số lượng tồn kho', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng tồn kho phải là số nguyên' })
  @Min(0, { message: 'Số lượng tồn kho không được âm' })
  stockQuantity?: number;

  @ApiPropertyOptional({ description: 'Ngưỡng cảnh báo hết hàng', default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  lowStockThreshold?: number;

  @ApiPropertyOptional({ description: 'SKU mặc định', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Thuộc tính biến thể', type: [VariantAttributeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantAttributeDto)
  variantAttributes?: VariantAttributeDto[];
}

export class UpdateSKUDto {
  @ApiPropertyOptional({ description: 'Mã vạch' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Tên biến thể' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Giá bán' })
  @IsOptional()
  @IsNumber({}, { message: 'Giá bán phải là số' })
  @Min(0, { message: 'Giá bán không được âm' })
  price?: number;

  @ApiPropertyOptional({ description: 'Giá cũ' })
  @IsOptional()
  @IsNumber({}, { message: 'Giá cũ phải là số' })
  oldPrice?: number | null;

  @ApiPropertyOptional({ description: 'Giá vốn' })
  @IsOptional()
  @IsNumber()
  costPrice?: number | null;

  @ApiPropertyOptional({ description: 'Ngưỡng cảnh báo hết hàng' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  lowStockThreshold?: number;

  @ApiPropertyOptional({ description: 'SKU mặc định' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ProductSpecificationDto {
  @ApiProperty({ description: 'ID định nghĩa thông số' })
  @IsString({ message: 'ID thông số phải là chuỗi' })
  @IsNotEmpty({ message: 'ID thông số không được để trống' })
  specificationDefinitionId: string;

  @ApiPropertyOptional({ description: 'Giá trị dạng text' })
  @IsOptional()
  @IsString()
  valueText?: string;

  @ApiPropertyOptional({ description: 'Giá trị dạng số' })
  @IsOptional()
  @IsNumber()
  valueNumber?: number;

  @ApiPropertyOptional({ description: 'Giá trị dạng đúng/sai' })
  @IsOptional()
  @IsBoolean()
  valueBoolean?: boolean;
}

export class CreateProductSpecificationsDto {
  @ApiProperty({ description: 'Danh sách thông số kỹ thuật', type: [ProductSpecificationDto] })
  @IsArray({ message: 'Danh sách thông số phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  specifications: ProductSpecificationDto[];
}

export class ProductQueryDto {
  @ApiPropertyOptional({ description: 'Trang hiện tại', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng mỗi trang', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Slug danh mục' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Slug thương hiệu' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Giá tối thiểu' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Giá tối đa' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Sắp xếp: featured, price_asc, price_desc, newest' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm' })
  @IsOptional()
  @IsString()
  q?: string;
}
