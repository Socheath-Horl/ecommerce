import { Module } from '@nestjs/common';
import { FilesController } from '@/modules/files/files.controller';
import { FilesService } from '@/modules/files/files.service';
import { MinioModule } from '@/modules/minio/minio.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [MinioModule, AuthModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}