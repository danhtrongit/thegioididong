import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMediaFolderDto, UpdateMediaFolderDto, UpdateMediaAssetDto } from './dto/media.dto.js';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
];

@Injectable()
export class MediaService {
  private uploadDir: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // ==================== FOLDERS ====================

  async getFolders() {
    return this.prisma.mediaFolder.findMany({
      include: { children: { orderBy: { sortOrder: 'asc' } }, _count: { select: { assets: true } } },
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async createFolder(dto: CreateMediaFolderDto) {
    const existing = await this.prisma.mediaFolder.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Slug thư mục đã tồn tại');
    return this.prisma.mediaFolder.create({ data: dto });
  }

  async updateFolder(id: string, dto: UpdateMediaFolderDto) {
    const folder = await this.prisma.mediaFolder.findUnique({ where: { id } });
    if (!folder) throw new NotFoundException('Không tìm thấy thư mục');
    return this.prisma.mediaFolder.update({ where: { id }, data: dto });
  }

  // ==================== ASSETS ====================

  async getAssets(query: { folderId?: string; page: number; limit: number; q?: string }) {
    const skip = (query.page - 1) * query.limit;
    const where: any = { status: 'ACTIVE' };
    if (query.folderId) where.folderId = query.folderId;
    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { altText: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [assets, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({
        where, skip, take: query.limit,
        include: { folder: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mediaAsset.count({ where }),
    ]);
    return { assets, total };
  }

  async uploadAsset(file: Express.Multer.File, userId: string, folderId?: string) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Loại file không được hỗ trợ. Chỉ chấp nhận: JPEG, PNG, WebP, GIF, SVG');
    }

    const maxSize = this.configService.get<number>('MAX_FILE_SIZE', 10485760);
    if (file.size > maxSize) {
      throw new BadRequestException(`File quá lớn. Kích thước tối đa: ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    const ext = path.extname(file.originalname);
    const storageKey = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, storageKey);
    fs.writeFileSync(filePath, file.buffer);

    const url = `/uploads/${storageKey}`;

    return this.prisma.mediaAsset.create({
      data: {
        folderId,
        uploadedByUserId: userId,
        storageKey,
        url,
        mimeType: file.mimetype,
        fileSizeBytes: file.size,
        title: file.originalname,
      },
    });
  }

  async updateAsset(id: string, dto: UpdateMediaAssetDto) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Không tìm thấy file media');
    return this.prisma.mediaAsset.update({ where: { id }, data: dto });
  }

  async deleteAsset(id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Không tìm thấy file media');

    // Archive instead of hard delete if referenced
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }
}
