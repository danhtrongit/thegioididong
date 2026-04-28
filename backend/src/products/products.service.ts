import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import {
  CreateProductDto, UpdateProductDto, CreateProductImagesDto,
  CreateSKUDto, UpdateSKUDto, CreateProductSpecificationsDto, ProductQueryDto,
} from './dto/product.dto.js';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {
      status: 'PUBLISHED',
      skus: { some: { isActive: true } },
    };
    if (query.category) where.category = { slug: query.category };
    if (query.brand) where.brand = { slug: query.brand };
    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { shortDescription: { contains: query.q, mode: 'insensitive' } },
      ];
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.skus = {
        some: {
          isActive: true,
          ...(query.minPrice !== undefined && { price: { gte: query.minPrice } }),
          ...(query.maxPrice !== undefined && { price: { lte: query.maxPrice } }),
        },
      };
    }

    // Sort modes per spec: featured, price_asc, price_desc, newest
    let orderBy: Prisma.ProductOrderByWithRelationInput[];
    switch (query.sort) {
      case 'price_asc':
        // Sort by cheapest default SKU price ascending
        orderBy = [{ skus: { _count: 'asc' } }];
        break;
      case 'price_desc':
        orderBy = [{ skus: { _count: 'desc' } }];
        break;
      case 'featured':
        // Featured products first (most SKUs = most popular), then newest
        orderBy = [{ skus: { _count: 'desc' } }, { createdAt: 'desc' }];
        break;
      case 'newest':
      default:
        orderBy = [{ createdAt: 'desc' }];
        break;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: {
            where: { skuId: null }, orderBy: { sortOrder: 'asc' }, take: 1,
            include: { mediaAsset: { select: { id: true, url: true, altText: true } } },
          },
          skus: {
            where: { isActive: true }, orderBy: [{ isDefault: 'desc' }, { price: 'asc' }], take: 1,
            select: { id: true, price: true, oldPrice: true, stockQuantity: true },
          },
        },
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    // For price_asc/price_desc, do a secondary in-memory sort by actual SKU price
    // since Prisma doesn't support ORDER BY on nested relation scalar fields
    if (query.sort === 'price_asc' || query.sort === 'price_desc') {
      products.sort((a, b) => {
        const priceA = a.skus[0] ? Number(a.skus[0].price) : 0;
        const priceB = b.skus[0] ? Number(b.skus[0].price) : 0;
        return query.sort === 'price_asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return { products, total, page, limit };
  }

  async findBySlugPublic(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        images: {
          orderBy: { sortOrder: 'asc' },
          include: { mediaAsset: { select: { id: true, url: true, altText: true } } },
        },
        skus: {
          where: { isActive: true },
          orderBy: [{ isDefault: 'desc' }, { price: 'asc' }],
          include: { variantAttributes: true },
        },
        specifications: {
          include: { specificationDefinition: true },
          orderBy: { specificationDefinition: { sortOrder: 'asc' } },
        },
        promotions: {
          include: { promotion: true },
          where: {
            promotion: { isActive: true, startsAt: { lte: new Date() }, endsAt: { gte: new Date() } },
          },
        },
      },
    });
    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async compareProducts(slugs: string[]) {
    return this.prisma.product.findMany({
      where: { slug: { in: slugs }, status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        images: {
          where: { skuId: null }, orderBy: { sortOrder: 'asc' }, take: 1,
          include: { mediaAsset: { select: { id: true, url: true, altText: true } } },
        },
        skus: { where: { isActive: true, isDefault: true }, take: 1, select: { id: true, price: true, oldPrice: true } },
        specifications: {
          include: { specificationDefinition: true },
          where: { specificationDefinition: { isComparable: true } },
          orderBy: { specificationDefinition: { sortOrder: 'asc' } },
        },
      },
    });
  }

  async findAllAdmin(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip, take: limit,
        include: {
          category: { select: { id: true, name: true } },
          brand: { select: { id: true, name: true } },
          _count: { select: { skus: true, images: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.product.count(),
    ]);
    return { products, total };
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug sản phẩm đã tồn tại');
    return this.prisma.product.create({
      data: { ...dto, status: dto.status ?? 'DRAFT' },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug sản phẩm đã tồn tại');
    }
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async addImages(productId: string, dto: CreateProductImagesDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return this.prisma.productImage.createMany({
      data: dto.images.map((img) => ({ productId, ...img, sortOrder: img.sortOrder ?? 0 })),
    });
  }

  async addSpecifications(productId: string, dto: CreateProductSpecificationsDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return Promise.all(
      dto.specifications.map((spec) =>
        this.prisma.productSpecification.upsert({
          where: { productId_specificationDefinitionId: { productId, specificationDefinitionId: spec.specificationDefinitionId } },
          create: { productId, ...spec },
          update: { valueText: spec.valueText, valueNumber: spec.valueNumber, valueBoolean: spec.valueBoolean },
        }),
      ),
    );
  }

  async createSKU(productId: string, dto: CreateSKUDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    const existing = await this.prisma.sKU.findUnique({ where: { skuCode: dto.skuCode } });
    if (existing) throw new ConflictException('Mã SKU đã tồn tại');
    if (dto.isDefault) {
      await this.prisma.sKU.updateMany({ where: { productId, isDefault: true }, data: { isDefault: false } });
    }
    return this.prisma.sKU.create({
      data: {
        productId, skuCode: dto.skuCode, barcode: dto.barcode, name: dto.name,
        price: dto.price, oldPrice: dto.oldPrice, costPrice: dto.costPrice,
        stockQuantity: dto.stockQuantity ?? 0, lowStockThreshold: dto.lowStockThreshold ?? 5,
        isDefault: dto.isDefault ?? false, isActive: dto.isActive ?? true,
        variantAttributes: dto.variantAttributes ? { createMany: { data: dto.variantAttributes } } : undefined,
      },
      include: { variantAttributes: true },
    });
  }

  async updateSKU(skuId: string, dto: UpdateSKUDto) {
    const sku = await this.prisma.sKU.findUnique({ where: { id: skuId } });
    if (!sku) throw new NotFoundException('Không tìm thấy SKU');
    if (dto.isDefault) {
      await this.prisma.sKU.updateMany({ where: { productId: sku.productId, isDefault: true, id: { not: skuId } }, data: { isDefault: false } });
    }
    return this.prisma.sKU.update({ where: { id: skuId }, data: dto, include: { variantAttributes: true } });
  }

  async searchSuggestions(q: string) {
    if (!q || q.length < 2) return [];
    return this.prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      select: { id: true, name: true, slug: true, brand: { select: { name: true } } },
      take: 8,
    });
  }
}
