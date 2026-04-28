import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSpecDefinitionDto } from './dto/specification.dto.js';

@Injectable()
export class SpecificationsService {
  constructor(private prisma: PrismaService) {}

  async findByCategory(categoryId: string) {
    return this.prisma.specificationDefinition.findMany({
      where: { categoryId },
      orderBy: [{ groupName: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async create(dto: CreateSpecDefinitionDto) {
    return this.prisma.specificationDefinition.create({ data: dto });
  }

  async update(id: string, dto: Partial<CreateSpecDefinitionDto>) {
    const spec = await this.prisma.specificationDefinition.findUnique({ where: { id } });
    if (!spec) throw new NotFoundException('Không tìm thấy định nghĩa thông số');
    return this.prisma.specificationDefinition.update({ where: { id }, data: dto });
  }
}
