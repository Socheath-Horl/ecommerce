import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from '@/modules/users/users.service';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { ApiErrorDto } from '@/common/dto/response.dto';
import { ListUsersQueryDto } from '@/modules/users/dto/list-users-query.dto';
import { ListUsersResponseDto } from '@/modules/users/dto/users.response.dto';

@ApiTags('users')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'List users with pagination, search and role filter (ADMIN only)' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ListUsersResponseDto, description: 'Paginated list of users' })
  @ApiUnauthorizedResponse({ type: ApiErrorDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: ApiErrorDto, description: 'Not admin' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() query: ListUsersQueryDto) {
    return { success: true, ...(await this.usersService.findAll(query)) };
  }
}