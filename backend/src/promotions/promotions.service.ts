import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/promotion.dto.js';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [promotions, total] = await Promise.all([
      this.prisma.promotion.findMany({
        skip, take: limit,
        include: {
          products: { include: { product: { select: { id: true, name: true } } } },
          skus: { include: { sku: { select: { id: true, skuCode: true, name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.promotion.count(),
    ]);
    return { promotions, total };
  }

  async create(dto: CreatePromotionDto) {
    return this.prisma.promotion.create({
      data: {
        title: dto.title,
        description: dto.description,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        isActive: dto.isActive ?? true,
        products: dto.productIds
          ? { createMany: { data: dto.productIds.map((id) => ({ productId: id })) } }
          : undefined,
        skus: dto.skuIds
          ? { createMany: { data: dto.skuIds.map((id) => ({ skuId: id })) } }
          : undefined,
      },
      include: { products: true, skus: true },
    });
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const promo = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promo) throw new NotFoundException('Không tìm thấy khuyến mãi');

    const data: any = { ...dto };
    if (dto.startsAt) data.startsAt = new Date(dto.startsAt);
    if (dto.endsAt) data.endsAt = new Date(dto.endsAt);

    return this.prisma.promotion.update({ where: { id }, data });
  }
}
