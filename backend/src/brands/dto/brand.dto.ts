import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ description: 'Tên thương hiệu', example: 'Apple' })
  @IsString({ message: 'Tên thương hiệu phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên thương hiệu không được để trống' })
  name: string;

  @ApiProperty({ description: 'Đường dẫn SEO', example: 'apple' })
  @IsString({ message: 'Slug phải là chuỗi' })
  @IsNotEmpty({ message: 'Slug không được để trống' })
  slug: string;

  @ApiPropertyOptional({ description: 'ID logo' })
  @IsOptional()
  @IsString()
  logoMediaAssetId?: string;

  @ApiPropertyOptional({ description: 'Mô tả thương hiệu' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt', default: true })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là đúng/sai' })
  isActive?: boolean;
}

export class UpdateBrandDto {
  @ApiPropertyOptional({ description: 'Tên thương hiệu' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Đường dẫn SEO' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'ID logo' })
  @IsOptional()
  @IsString()
  logoMediaAssetId?: string | null;

  @ApiPropertyOptional({ description: 'Mô tả thương hiệu' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Trạng thái kích hoạt' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
