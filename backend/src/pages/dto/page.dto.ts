import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '@prisma/client';

export class CreatePageDto {
  @ApiProperty({ description: 'Tiêu đề trang', example: 'Chính sách bảo hành' })
  @IsString() @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @ApiProperty({ description: 'Slug', example: 'chinh-sach-bao-hanh' })
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

  @ApiPropertyOptional({ description: 'Template: default, policy, store', default: 'default' })
  @IsOptional() @IsString()
  template?: string;

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

  @ApiPropertyOptional({ description: 'Hiển thị ở footer' })
  @IsOptional() @IsBoolean()
  showInFooter?: boolean;

  @ApiPropertyOptional({ description: 'Hiển thị ở trợ giúp thanh toán' })
  @IsOptional() @IsBoolean()
  showInCheckoutHelp?: boolean;

  @ApiPropertyOptional({ description: 'Hiển thị ở trợ giúp tài khoản' })
  @IsOptional() @IsBoolean()
  showInAccountHelp?: boolean;

  @ApiPropertyOptional({ description: 'Ngày xuất bản' })
  @IsOptional() @IsDateString()
  publishedAt?: string;
}

export class UpdatePageDto extends CreatePageDto {
  // All fields optional via extends with @IsOptional on parent
}
