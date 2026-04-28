import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto.js';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAllPublic() {
    return this.prisma.brand.findMany({
      where: { isActive: true },
      include: { logo: { select: { id: true, url: true, altText: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.brand.findMany({
      include: {
        logo: { select: { id: true, url: true, altText: true } },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateBrandDto) {
    const existing = await this.prisma.brand.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug thương hiệu đã tồn tại');

    return this.prisma.brand.create({ data: dto });
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Không tìm thấy thương hiệu');

    if (dto.slug && dto.slug !== brand.slug) {
      const existing = await this.prisma.brand.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug thương hiệu đã tồn tại');
    }

    return this.prisma.brand.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!brand) throw new NotFoundException('Không tìm thấy thương hiệu');
    if (brand._count.products > 0) {
      throw new ConflictException('Không thể xóa thương hiệu đang có sản phẩm');
    }
    return this.prisma.brand.delete({ where: { id } });
  }
}
