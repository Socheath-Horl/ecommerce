import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { Role, File as FileRecord } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { MinioService } from '@/modules/minio/minio.service';
import { FOLDER_BY_ENTITY_TYPE } from '@/modules/files/files.constants';

export interface FileListResult {
  items: FileRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable()
export class FilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  async upload(
    file: Express.Multer.File,
    userId: string,
    entityType?: string,
    entityId?: string,
  ): Promise<FileRecord> {
    const folder = entityType ? FOLDER_BY_ENTITY_TYPE[entityType] ?? 'uploads' : 'uploads';
    const fileName = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
    const key = entityId ? `${folder}/${entityId}/${fileName}` : `${folder}/${fileName}`;

    await this.minio.upload(key, file.buffer, file.mimetype);

    return this.prisma.file.create({
      data: {
        userId,
        originalName: file.originalname,
        fileName,
        mimeType: file.mimetype,
        size: file.size,
        bucket: this.minio.bucketName,
        key,
        url: this.minio.getUrl(key),
        entityType: entityType ?? null,
        entityId: entityId ?? null,
      },
    });
  }

  async findOne(id: string): Promise<FileRecord> {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  async findAll(filter: {
    entityType?: string;
    entityId?: string;
    page: number;
    limit: number;
  }): Promise<FileListResult> {
    const where = {
      ...(filter.entityType ? { entityType: filter.entityType } : {}),
      ...(filter.entityId ? { entityId: filter.entityId } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.file.findMany({
        where,
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.file.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page: filter.page,
        limit: filter.limit,
        total,
        totalPages: Math.ceil(total / filter.limit),
      },
    };
  }

  async deleteFile(id: string, userId: string, role: Role): Promise<void> {
    const file = await this.findOne(id);
    this.assertOwnerOrAdmin(file, userId, role);
    await this.minio.remove(file.key);
    await this.prisma.file.delete({ where: { id } });
  }

  async link(
    id: string,
    entityType: string,
    entityId: string,
    userId: string,
    role: Role,
  ): Promise<FileRecord> {
    const file = await this.findOne(id);
    this.assertOwnerOrAdmin(file, userId, role);
    return this.prisma.file.update({
      where: { id },
      data: { entityType, entityId },
    });
  }

  async unlink(id: string, userId: string, role: Role): Promise<FileRecord> {
    const file = await this.findOne(id);
    this.assertOwnerOrAdmin(file, userId, role);
    return this.prisma.file.update({
      where: { id },
      data: { entityType: null, entityId: null },
    });
  }

  private assertOwnerOrAdmin(file: FileRecord, userId: string, role: Role): void {
    if (file.userId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('Not file owner or admin');
    }
  }
}