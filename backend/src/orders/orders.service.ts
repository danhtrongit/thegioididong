import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto.js';
import { OrderStatus } from '@prisma/client';

// Valid order status transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: ['PROCESSING', 'CANCELED'],
  PROCESSING: ['SHIPPING', 'CANCELED'],
  SHIPPING: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
};

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto, userId?: string) {
    const orderCode = this.generateOrderCode();

    // All validation + stock decrement inside a single transaction to prevent overselling
    const order = await this.prisma.$transaction(async (tx) => {
      const orderItems: any[] = [];
      let subtotal = 0;

      for (const item of dto.items) {
        const sku = await tx.sKU.findUnique({
          where: { id: item.skuId },
          include: { product: { select: { name: true, status: true } } },
        });

        if (!sku) throw new BadRequestException(`SKU không tồn tại`);
        if (!sku.isActive) throw new BadRequestException(`${sku.name} đã ngừng kinh doanh`);
        if (sku.product.status !== 'PUBLISHED') throw new BadRequestException(`Sản phẩm ${sku.product.name} không khả dụng`);

        // Conditional stock decrement: only succeeds if enough stock exists
        const updated = await tx.sKU.updateMany({
          where: {
            id: item.skuId,
            stockQuantity: { gte: item.quantity },
          },
          data: { stockQuantity: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          // Re-fetch to get current stock for accurate error message
          const current = await tx.sKU.findUnique({ where: { id: item.skuId }, select: { stockQuantity: true } });
          throw new BadRequestException(
            `${sku.name} chỉ còn ${current?.stockQuantity ?? 0} sản phẩm`,
          );
        }

        // Record inventory movement
        await tx.inventoryMovement.create({
          data: {
            skuId: item.skuId,
            quantityChange: -item.quantity,
            reason: 'ORDER_PLACED',
            note: `Đơn hàng ${orderCode}`,
          },
        });

        const lineTotal = Number(sku.price) * item.quantity;
        subtotal += lineTotal;

        orderItems.push({
          skuId: sku.id,
          productName: sku.product.name,
          skuName: sku.name,
          unitPrice: sku.price,
          quantity: item.quantity,
          lineTotal,
        });
      }

      const grandTotal = subtotal; // No shipping fee or discount for MVP COD

      return tx.order.create({
        data: {
          orderCode,
          userId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          province: dto.province,
          district: dto.district,
          ward: dto.ward,
          address: dto.address,
          note: dto.note,
          fulfillmentMethod: dto.fulfillmentMethod ?? 'DELIVERY',
          paymentMethod: 'COD',
          subtotal,
          grandTotal,
          items: { createMany: { data: orderItems } },
        },
        include: { items: true },
      });
    });

    return order;
  }

  async lookupOrder(phone: string, orderCode: string) {
    const order = await this.prisma.order.findFirst({
      where: { customerPhone: phone, orderCode },
      include: {
        items: {
          include: { sku: { select: { skuCode: true } } },
        },
      },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async findAllAdmin(page: number, limit: number, filters: { status?: string; phone?: string; orderCode?: string }) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.phone) where.customerPhone = { contains: filters.phone };
    if (filters.orderCode) where.orderCode = { contains: filters.orderCode, mode: 'insensitive' };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where, skip, take: limit,
        include: { _count: { select: { items: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return { orders, total };
  }

  async findOneAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { sku: { select: { skuCode: true } } } },
        user: { select: { fullName: true, email: true } },
      },
    });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed || !allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ "${this.translateStatus(order.status)}" sang "${this.translateStatus(dto.status)}"`,
      );
    }

    // If canceling, restore stock
    if (dto.status === 'CANCELED') {
      const items = await this.prisma.orderItem.findMany({ where: { orderId: id } });

      await this.prisma.$transaction(async (tx) => {
        for (const item of items) {
          await tx.sKU.update({
            where: { id: item.skuId },
            data: { stockQuantity: { increment: item.quantity } },
          });
          await tx.inventoryMovement.create({
            data: {
              skuId: item.skuId,
              quantityChange: item.quantity,
              reason: 'ORDER_CANCELED',
              note: `Hủy đơn hàng ${order.orderCode}${dto.reason ? ': ' + dto.reason : ''}`,
            },
          });
        }
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status as OrderStatus,
        internalNote: dto.reason
          ? `${order.internalNote ? order.internalNote + '\n' : ''}[Hủy đơn] ${dto.reason}`
          : order.internalNote,
      },
    });
  }

  async addNote(id: string, note: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    const combined = order.internalNote
      ? `${order.internalNote}\n${newNote}`
      : newNote;

    return this.prisma.order.update({
      where: { id },
      data: { internalNote: combined },
    });
  }

  async getDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [dailyOrders, pendingOrders, completedRevenue, lowStockCount, recentOrders] = await Promise.all([
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { grandTotal: true },
      }),
      this.prisma.sKU.count({
        where: { isActive: true, stockQuantity: { lte: 5 } },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, orderCode: true, customerName: true,
          grandTotal: true, status: true, createdAt: true,
        },
      }),
    ]);

    return {
      dailyOrders,
      pendingOrders,
      completedRevenue: completedRevenue._sum.grandTotal ?? 0,
      lowStockCount,
      recentOrders,
    };
  }

  private generateOrderCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DH${timestamp}${random}`;
  }

  private translateStatus(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'Chờ xác nhận',
      CONFIRMED: 'Đã xác nhận',
      PROCESSING: 'Đang xử lý',
      SHIPPING: 'Đang giao hàng',
      COMPLETED: 'Hoàn thành',
      CANCELED: 'Đã hủy',
    };
    return map[status] || status;
  }
}
