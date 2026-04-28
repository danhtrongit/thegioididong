import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '@prisma/client';

export class CreateArticleCategoryDto {
  @ApiProperty({ description: 'Tên danh mục bài viết', example: 'Tin tức' })
  @IsString() @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @ApiProperty({ description: 'Slug', example: 'tin-tuc' })
  @IsString() @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Thứ tự' })
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Kích hoạt' })
  @IsOptional() @IsBoolean()
  isActive?: boolean;
}

export class CreateArticleTagDto {
  @ApiProperty({ description: 'Tên tag', example: 'iPhone' })
  @IsString() @IsNotEmpty({ message: 'Tên tag không được để trống' })
  name: string;

  @ApiProperty({ description: 'Slug', example: 'iphone' })
  @IsString() @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;
}

export class CreateArticleDto {
  @ApiProperty({ description: 'ID danh mục bài viết' })
  @IsString() @IsNotEmpty({ message: 'Danh mục không được để trống' })
  articleCategoryId: string;

  @ApiProperty({ description: 'Tiêu đề', example: 'Đánh giá iPhone 16 Pro Max' })
  @IsString() @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({ description: 'Slug', example: 'danh-gia-iphone-16-pro-max' })
  @IsString() @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @ApiPropertyOptional({ description: 'Trích dẫn ngắn' })
  @IsOptional() @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ description: 'ID ảnh bìa' })
  @IsOptional() @IsString()
  coverMediaAssetId?: string;

  @ApiPropertyOptional({ description: 'Nội dung Markdown' })
  @IsOptional() @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề SEO' })
  @IsOptional() @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'Mô tả SEO' })
  @IsOptional() @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'Canonical URL' })
  @IsOptional() @IsString()
  canonicalUrl?: string;

  @ApiPropertyOptional({ description: 'Trạng thái', enum: ContentStatus })
  @IsOptional() @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ description: 'Bài viết nổi bật' })
  @IsOptional() @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Ngày xuất bản' })
  @IsOptional() @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({ description: 'Danh sách ID tag' })
  @IsOptional() @IsArray()
  tagIds?: string[];

  @ApiPropertyOptional({ description: 'Danh sách ID sản phẩm liên quan' })
  @IsOptional() @IsArray()
  productIds?: string[];
}
