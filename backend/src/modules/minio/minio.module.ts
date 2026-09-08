import { Module } from '@nestjs/common';
import { MinioService } from '@/modules/minio/minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}