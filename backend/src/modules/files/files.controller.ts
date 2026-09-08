import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { MessageResponseDto } from '@/modules/auth/dto/auth-response.dto';
import {
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_FILE_TYPES,
  FILE_ENTITY_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_PER_REQUEST,
} from '@/modules/files/files.constants';
import { FilesService } from '@/modules/files/files.service';
import {
  FileListResponseDto,
  FileResponseDto,
  FilesArrayResponseDto,
  FileUploadDto,
  LinkFileDto,
  ListFilesQueryDto,
} from '@/modules/files/dto/files.dto';

const uploadOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowedExtension = (ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(
      `.${file.originalname.split('.').pop()?.toLowerCase() ?? ''}`,
    );
    const allowedMime = (ALLOWED_FILE_TYPES as readonly string[]).includes(file.mimetype);
    if (!allowedExtension || !allowedMime) {
      cb(new BadRequestException('Only jpg, jpeg, png or webp files are allowed'), false);
      return;
    }
    cb(null, true);
  },
};

const singleApiBody = {
  schema: {
    type: 'object',
    required: ['file'],
    properties: {
      file: { type: 'string', format: 'binary' },
      entityType: { type: 'string', enum: [...FILE_ENTITY_TYPES] },
      entityId: { type: 'string' },
    },
  },
};

const multipleApiBody = {
  schema: {
    type: 'object',
    required: ['files'],
    properties: {
      files: { type: 'array', items: { type: 'string', format: 'binary' } },
      entityType: { type: 'string', enum: [...FILE_ENTITY_TYPES] },
      entityId: { type: 'string' },
    },
  },
};

type AuthenticatedRequest = Request & { user: { id: string; role: string } };

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(singleApiBody)
  @ApiCreatedResponse({ type: FileResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: FileUploadDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const saved = await this.files.upload(file, req.user.id, dto.entityType, dto.entityId);
    return { success: true, data: saved };
  }

  @Post('upload/multiple')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files', MAX_FILES_PER_REQUEST, uploadOptions))
  @ApiOperation({ summary: 'Upload up to 5 files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(multipleApiBody)
  @ApiCreatedResponse({ type: FilesArrayResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @Body() dto: FileUploadDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!files?.length) throw new BadRequestException('Files are required');
    const saved = await Promise.all(
      files.map((file) => this.files.upload(file, req.user.id, dto.entityType, dto.entityId)),
    );
    return { success: true, data: saved };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List files (filter + paginate)' })
  @ApiOkResponse({ type: FileListResponseDto })
  async list(@Query() query: ListFilesQueryDto) {
    const { items, pagination } = await this.files.findAll({
      entityType: query.entityType,
      entityId: query.entityId,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
    return { success: true, data: items, pagination };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a file by id (public)' })
  @ApiOkResponse({ type: FileResponseDto })
  async findOne(@Param('id') id: string) {
    const file = await this.files.findOne(id);
    return { success: true, data: file };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', format: 'uuid', description: 'File id' })
  @ApiOperation({ summary: 'Delete a file (owner or admin)' })
  @ApiOkResponse({ type: MessageResponseDto, description: 'File deleted' })
  @ApiNotFoundResponse({ description: 'File not found' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.files.deleteFile(id, req.user.id, req.user.role as never);
    return { success: true, message: 'File deleted' };
  }

  @Put(':id/link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', format: 'uuid', description: 'File id' })
  @ApiOperation({ summary: 'Link a file to an entity (owner or admin)' })
  @ApiOkResponse({ type: FileResponseDto })
  @ApiNotFoundResponse({ description: 'File not found' })
  async link(@Param('id') id: string, @Body() dto: LinkFileDto, @Req() req: AuthenticatedRequest) {
    const file = await this.files.link(id, dto.entityType, dto.entityId, req.user.id, req.user.role as never);
    return { success: true, data: file };
  }

  @Put(':id/unlink')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', format: 'uuid', description: 'File id' })
  @ApiOperation({ summary: 'Unlink a file from its entity (owner or admin)' })
  @ApiOkResponse({ type: FileResponseDto })
  @ApiNotFoundResponse({ description: 'File not found' })
  async unlink(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const file = await this.files.unlink(id, req.user.id, req.user.role as never);
    return { success: true, data: file };
  }
}