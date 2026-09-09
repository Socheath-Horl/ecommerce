import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersService } from '@/modules/users/users.service';
import { UsersController } from '@/modules/users/users.controller';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}