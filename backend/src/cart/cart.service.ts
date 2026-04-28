import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ValidateCartDto } from './dto/cart.dto.js';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async validateCart(dto: ValidateCartDto) {
    const errors: string[] = [];
    const validatedItems: any[] = [];

    for (const item of dto.items) {
      const sku = await this.prisma.sKU.findUnique({
        where: { id: item.skuId },
        include: {
          product: { select: { id: true, name: true, slug: true, status: true } },
          variantAttributes: true,
        },
      });

      if (!sku) {
        errors.push(`SKU ${item.skuId} không tồn tại`);
        continue;
      }

      if (!sku.isActive) {
        errors.push(`${sku.name} đã ngừng kinh doanh`);
        continue;
      }

      if (sku.product.status !== 'PUBLISHED') {
        errors.push(`Sản phẩm ${sku.product.name} chưa được xuất bản`);
        continue;
      }

      if (sku.stockQuantity < item.quantity) {
        errors.push(`${sku.name} chỉ còn ${sku.stockQuantity} sản phẩm trong kho`);
        continue;
      }

      validatedItems.push({
        skuId: sku.id,
        skuCode: sku.skuCode,
        productName: sku.product.name,
        skuName: sku.name,
        unitPrice: Number(sku.price),
        oldPrice: sku.oldPrice ? Number(sku.oldPrice) : null,
        quantity: item.quantity,
        lineTotal: Number(sku.price) * item.quantity,
        stockQuantity: sku.stockQuantity,
        variantAttributes: sku.variantAttributes,
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Giỏ hàng có lỗi',
        errors: { cart: errors },
      });
    }

    const subtotal = validatedItems.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
      items: validatedItems,
      subtotal,
      shippingFee: 0,
      grandTotal: subtotal,
    };
  }
}
