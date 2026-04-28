import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePageDto } from './dto/page.dto.js';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findBySlugPublic(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: { coverImage: { select: { id: true, url: true, altText: true } } },
    });
    if (!page || page.status !== 'PUBLISHED' || (page.publishedAt && page.publishedAt > new Date())) {
      throw new NotFoundException('Không tìm thấy trang');
    }
    return page;
  }

  async findAllAdmin(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        skip, take: limit,
        include: { author: { select: { fullName: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.page.count(),
    ]);
    return { pages, total };
  }

  async create(dto: CreatePageDto, userId: string) {
    const existing = await this.prisma.page.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug trang đã tồn tại');

    return this.prisma.page.create({
      data: {
        ...dto,
        authorUserId: userId,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      },
    });
  }

  async update(id: string, dto: Partial<CreatePageDto>) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) throw new NotFoundException('Không tìm thấy trang');

    const data: any = { ...dto };
    if (dto.publishedAt) data.publishedAt = new Date(dto.publishedAt);

    return this.prisma.page.update({ where: { id }, data });
  }

  async preview(id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: { coverImage: { select: { id: true, url: true, altText: true } } },
    });
    if (!page) throw new NotFoundException('Không tìm thấy trang');
    return page;
  }
}
