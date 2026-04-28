import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        image: { select: { id: true, url: true, altText: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBySlugPublic(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
        image: { select: { id: true, url: true, altText: true } },
        specificationDefinitions: {
          where: { isFilterable: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!category || !category.isActive) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }
    return category;
  }

  async findAllAdmin() {
    return this.prisma.category.findMany({
      include: {
        children: { orderBy: { sortOrder: 'asc' } },
        image: { select: { id: true, url: true, altText: true } },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug danh mục đã tồn tại');

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        parentId: dto.parentId,
        imageMediaAssetId: dto.imageMediaAssetId,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug danh mục đã tồn tại');
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });
    if (!category) throw new NotFoundException('Không tìm thấy danh mục');
    if (category._count.products > 0) {
      throw new ConflictException('Không thể xóa danh mục đang có sản phẩm');
    }
    if (category._count.children > 0) {
      throw new ConflictException('Không thể xóa danh mục đang có danh mục con');
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
