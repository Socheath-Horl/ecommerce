import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { FILE_ENTITY_TYPES } from '@/modules/files/files.constants';
import { ApiResponse, ListResponse } from '@/common/dto/response.dto';

export class FileUploadDto {
  @ApiPropertyOptional({ enum: FILE_ENTITY_TYPES, description: 'Entity type the file belongs to' })
  @IsOptional()
  @IsIn(FILE_ENTITY_TYPES)
  entityType?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'ID of the entity to link' })
  @IsOptional()
  @IsUUID()
  entityId?: string;
}

export class LinkFileDto {
  @ApiProperty({ enum: FILE_ENTITY_TYPES })
  @IsIn(FILE_ENTITY_TYPES)
  entityType: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  entityId: string;
}

export class ListFilesQueryDto {
  @ApiPropertyOptional({ enum: FILE_ENTITY_TYPES })
  @IsOptional()
  @IsIn(FILE_ENTITY_TYPES)
  entityType?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class FileDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Original client filename' })
  originalName: string;

  @ApiProperty({ description: 'Stored filename (uuid + extension)' })
  fileName: string;

  @ApiProperty({ example: 'image/png' })
  mimeType: string;

  @ApiProperty({ example: 24576 })
  size: number;

  @ApiProperty({ example: 'ecommerce' })
  bucket: string;

  @ApiProperty({ description: 'Object key inside the bucket' })
  key: string;

  @ApiProperty({ description: 'Public URL' })
  url: string;

  @ApiPropertyOptional({ nullable: true })
  entityType?: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  entityId?: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class FileResponseDto extends ApiResponse(FileDto) {}
export class FilesArrayResponseDto extends ApiResponse([FileDto]) {}
export class FileListResponseDto extends ListResponse([FileDto]) {}