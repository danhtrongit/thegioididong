import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InventoryReason } from '@prisma/client';

export class CreateInventoryMovementDto {
  @ApiProperty({ description: 'ID SKU' })
  @IsString() @IsNotEmpty({ message: 'ID SKU không được để trống' })
  skuId: string;

  @ApiProperty({ description: 'Số lượng thay đổi (dương: nhập, âm: xuất)', example: 10 })
  @Type(() => Number) @IsInt({ message: 'Số lượng phải là số nguyên' })
  quantityChange: number;

  @ApiProperty({ description: 'Lý do', enum: InventoryReason })
  @IsEnum(InventoryReason, { message: 'Lý do không hợp lệ' })
  reason: InventoryReason;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional() @IsString()
  note?: string;
}
