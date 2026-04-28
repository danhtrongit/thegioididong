import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInventoryMovementDto } from './dto/inventory.dto.js';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async createMovement(dto: CreateInventoryMovementDto, userId: string) {
    const sku = await this.prisma.sKU.findUnique({ where: { id: dto.skuId } });
    if (!sku) throw new NotFoundException('Không tìm thấy SKU');

    const [movement] = await this.prisma.$transaction([
      this.prisma.inventoryMovement.create({
        data: {
          skuId: dto.skuId,
          quantityChange: dto.quantityChange,
          reason: dto.reason,
          note: dto.note,
          createdByUserId: userId,
        },
      }),
      this.prisma.sKU.update({
        where: { id: dto.skuId },
        data: { stockQuantity: { increment: dto.quantityChange } },
      }),
    ]);

    return movement;
  }

  async getMovements(skuId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [movements, total] = await Promise.all([
      this.prisma.inventoryMovement.findMany({
        where: { skuId },
        skip, take: limit,
        include: { createdBy: { select: { fullName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventoryMovement.count({ where: { skuId } }),
    ]);
    return { movements, total };
  }

  async getLowStock(threshold?: number) {
    return this.prisma.sKU.findMany({
      where: {
        isActive: true,
        stockQuantity: { lte: threshold ?? 5 },
      },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { stockQuantity: 'asc' },
    });
  }
}
