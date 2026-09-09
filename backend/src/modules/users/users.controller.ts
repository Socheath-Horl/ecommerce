import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
import { UpdateRoleDto } from '@/modules/users/dto/update-role.dto';
import {
  ListUsersResponseDto,
  UpdateRoleResponseDto,
} from '@/modules/users/dto/users.response.dto';

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

  @ApiOperation({ summary: 'Update a user role (ADMIN only)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({ type: UpdateRoleResponseDto, description: 'Role updated' })
  @ApiBadRequestResponse({ type: ApiErrorDto, description: 'Invalid role or self-role change' })
  @ApiNotFoundResponse({ type: ApiErrorDto, description: 'User not found' })
  @ApiForbiddenResponse({ type: ApiErrorDto, description: 'Not admin' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id/role')
  async updateRole(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    const { id: actorId } = (req as Request & { user: { id: string } }).user;
    return { success: true, data: await this.usersService.updateRole(actorId, id, dto) };
  }
}