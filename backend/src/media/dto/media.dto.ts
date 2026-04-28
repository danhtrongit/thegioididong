import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMediaFolderDto {
  @ApiProperty({ description: 'Tên thư mục', example: 'Sản phẩm' })
  @IsString() @IsNotEmpty({ message: 'Tên thư mục không được để trống' })
  name: string;

  @ApiProperty({ description: 'Slug', example: 'san-pham' })
  @IsString() @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @ApiPropertyOptional({ description: 'ID thư mục cha' })
  @IsOptional() @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Thứ tự' })
  @IsOptional() @Type(() => Number) @IsInt()
  sortOrder?: number;
}

export class UpdateMediaFolderDto {
  @ApiPropertyOptional({ description: 'Tên thư mục' })
  @IsOptional() @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Slug' })
  @IsOptional() @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Thứ tự' })
  @IsOptional() @Type(() => Number) @IsInt()
  sortOrder?: number;
}

export class UpdateMediaAssetDto {
  @ApiPropertyOptional({ description: 'Tiêu đề' })
  @IsOptional() @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Alt text cho SEO' })
  @IsOptional() @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'ID thư mục' })
  @IsOptional() @IsString()
  folderId?: string;
}
