import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateArticleCategoryDto, CreateArticleTagDto, CreateArticleDto } from './dto/article.dto.js';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  // ==================== ARTICLE CATEGORIES ====================
  async findCategoriesPublic() {
    return this.prisma.articleCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findCategoriesAdmin() {
    return this.prisma.articleCategory.findMany({
      include: { _count: { select: { articles: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createCategory(dto: CreateArticleCategoryDto) {
    const existing = await this.prisma.articleCategory.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug danh mục bài viết đã tồn tại');
    return this.prisma.articleCategory.create({ data: dto });
  }

  async updateCategory(id: string, dto: Partial<CreateArticleCategoryDto>) {
    const cat = await this.prisma.articleCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Không tìm thấy danh mục bài viết');
    return this.prisma.articleCategory.update({ where: { id }, data: dto });
  }

  // ==================== TAGS ====================
  async findTagsAdmin() {
    return this.prisma.articleTag.findMany({ orderBy: { name: 'asc' } });
  }

  async createTag(dto: CreateArticleTagDto) {
    const existing = await this.prisma.articleTag.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug tag đã tồn tại');
    return this.prisma.articleTag.create({ data: dto });
  }

  async updateTag(id: string, dto: Partial<CreateArticleTagDto>) {
    return this.prisma.articleTag.update({ where: { id }, data: dto });
  }

  // ==================== ARTICLES ====================
  async findAllPublic(page: number, limit: number, categorySlug?: string) {
    const skip = (page - 1) * limit;
    const where: any = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    };
    if (categorySlug) {
      where.articleCategory = { slug: categorySlug };
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where, skip, take: limit,
        include: {
          articleCategory: { select: { id: true, name: true, slug: true } },
          author: { select: { fullName: true } },
          coverImage: { select: { id: true, url: true, altText: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.article.count({ where }),
    ]);
    return { articles, total };
  }

  async findBySlugPublic(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        articleCategory: { select: { id: true, name: true, slug: true } },
        author: { select: { fullName: true } },
        coverImage: { select: { id: true, url: true, altText: true } },
        tags: { include: { tag: true } },
        products: {
          include: {
            product: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    if (!article || article.status !== 'PUBLISHED' || (article.publishedAt && article.publishedAt > new Date())) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }
    return article;
  }

  async findAllAdmin(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        skip, take: limit,
        include: {
          articleCategory: { select: { name: true } },
          author: { select: { fullName: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.article.count(),
    ]);
    return { articles, total };
  }

  async create(dto: CreateArticleDto, userId: string) {
    const existing = await this.prisma.article.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug bài viết đã tồn tại');

    return this.prisma.article.create({
      data: {
        articleCategoryId: dto.articleCategoryId,
        authorUserId: userId,
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        coverMediaAssetId: dto.coverMediaAssetId,
        content: dto.content,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        canonicalUrl: dto.canonicalUrl,
        status: dto.status ?? 'DRAFT',
        isFeatured: dto.isFeatured ?? false,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        tags: dto.tagIds
          ? { createMany: { data: dto.tagIds.map((id) => ({ articleTagId: id })) } }
          : undefined,
        products: dto.productIds
          ? { createMany: { data: dto.productIds.map((id) => ({ productId: id })) } }
          : undefined,
      },
    });
  }

  async update(id: string, dto: Partial<CreateArticleDto>) {
    const article = await this.prisma.article.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');

    const data: any = { ...dto };
    if (dto.publishedAt) data.publishedAt = new Date(dto.publishedAt);
    delete data.tagIds;
    delete data.productIds;

    // Handle tag/product relation updates
    if (dto.tagIds) {
      await this.prisma.articleTagMap.deleteMany({ where: { articleId: id } });
      await this.prisma.articleTagMap.createMany({
        data: dto.tagIds.map((tagId) => ({ articleId: id, articleTagId: tagId })),
      });
    }
    if (dto.productIds) {
      await this.prisma.articleProduct.deleteMany({ where: { articleId: id } });
      await this.prisma.articleProduct.createMany({
        data: dto.productIds.map((productId) => ({ articleId: id, productId })),
      });
    }

    return this.prisma.article.update({ where: { id }, data });
  }

  async preview(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        articleCategory: true,
        author: { select: { fullName: true } },
        coverImage: { select: { id: true, url: true, altText: true } },
        tags: { include: { tag: true } },
        products: { include: { product: { select: { id: true, name: true, slug: true } } } },
      },
    });
    if (!article) throw new NotFoundException('Không tìm thấy bài viết');
    return article;
  }
}
