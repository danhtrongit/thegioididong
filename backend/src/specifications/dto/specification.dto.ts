import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SpecValueType } from '@prisma/client';

export class CreateSpecDefinitionDto {
  @ApiProperty({ description: 'ID danh mục' })
  @IsString() @IsNotEmpty({ message: 'Danh mục không được để trống' })
  categoryId: string;

  @ApiProperty({ description: 'Tên nhóm thông số', example: 'Màn hình' })
  @IsString() @IsNotEmpty({ message: 'Tên nhóm không được để trống' })
  groupName: string;

  @ApiProperty({ description: 'Tên thông số', example: 'Kích thước màn hình' })
  @IsString() @IsNotEmpty({ message: 'Tên thông số không được để trống' })
  name: string;

  @ApiPropertyOptional({ description: 'Loại giá trị', enum: SpecValueType })
  @IsOptional() @IsEnum(SpecValueType)
  valueType?: SpecValueType;

  @ApiPropertyOptional({ description: 'Đơn vị', example: 'inch' })
  @IsOptional() @IsString()
  unit?: string;

  @ApiPropertyOptional({ description: 'Có thể lọc' })
  @IsOptional() @IsBoolean()
  isFilterable?: boolean;

  @ApiPropertyOptional({ description: 'Có thể so sánh' })
  @IsOptional() @IsBoolean()
  isComparable?: boolean;

  @ApiPropertyOptional({ description: 'Hiển thị nổi bật' })
  @IsOptional() @IsBoolean()
  isHighlighted?: boolean;

  @ApiPropertyOptional({ description: 'Thứ tự' })
  @IsOptional() @Type(() => Number) @IsInt()
  sortOrder?: number;
}
