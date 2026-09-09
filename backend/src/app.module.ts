import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { MinioModule } from '@/modules/minio/minio.module';
import { FilesModule } from '@/modules/files/files.module';
import { UsersModule } from '@/modules/users/users.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    MinioModule,
    FilesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
