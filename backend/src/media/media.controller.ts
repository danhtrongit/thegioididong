import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { MediaService } from './media.service.js';
import { CreateMediaFolderDto, UpdateMediaFolderDto, UpdateMediaAssetDto } from './dto/media.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { successResponse, paginatedResponse } from '../common/helpers/response.helper.js';

@ApiTags('Thư viện media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.STAFF)
@Controller('admin/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('folders')
  @ApiOperation({ summary: 'Danh sách thư mục media' })
  async getFolders() {
    const folders = await this.mediaService.getFolders();
    return successResponse(folders, 'Lấy danh sách thư mục thành công');
  }

  @Post('folders')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo thư mục media' })
  async createFolder(@Body() dto: CreateMediaFolderDto) {
    const folder = await this.mediaService.createFolder(dto);
    return successResponse(folder, 'Tạo thư mục thành công');
  }

  @Patch('folders/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thư mục media' })
  async updateFolder(@Param('id') id: string, @Body() dto: UpdateMediaFolderDto) {
    const folder = await this.mediaService.updateFolder(id, dto);
    return successResponse(folder, 'Cập nhật thư mục thành công');
  }

  @Get('assets')
  @ApiOperation({ summary: 'Danh sách file media', description: 'Lọc theo thư mục, từ khóa' })
  async getAssets(
    @Query('folderId') folderId: string,
    @Query('q') q: string,
    @Query() pagination: PaginationDto,
  ) {
    const { assets, total } = await this.mediaService.getAssets({
      folderId, q, page: pagination.page, limit: pagination.limit,
    });
    return paginatedResponse(assets, total, pagination.page, pagination.limit, 'Lấy danh sách media thành công');
  }

  @Post('assets')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file media', description: 'Upload ảnh vào thư viện media' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
    @Body('folderId') folderId?: string,
  ) {
    const asset = await this.mediaService.uploadAsset(file, userId, folderId);
    return successResponse(asset, 'Upload file thành công');
  }

  @Patch('assets/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin media' })
  async updateAsset(@Param('id') id: string, @Body() dto: UpdateMediaAssetDto) {
    const asset = await this.mediaService.updateAsset(id, dto);
    return successResponse(asset, 'Cập nhật media thành công');
  }

  @Delete('assets/:id')
  @ApiOperation({ summary: 'Xóa (lưu trữ) file media' })
  async deleteAsset(@Param('id') id: string) {
    await this.mediaService.deleteAsset(id);
    return successResponse(null, 'Xóa media thành công');
  }
}
