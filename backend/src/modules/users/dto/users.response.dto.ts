import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ApiResponse, ListResponse } from '@/common/dto/response.dto';

export class AdminUserListItemDto {
  @ApiProperty({ format: 'uuid', description: 'User UUID' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  name: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ enum: Role, enumName: 'Role', description: 'User role' })
  role: Role;

  @ApiProperty({ description: 'Account creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Order count for the user', example: { orders: 3 } })
  _count: { orders: number };
}

export class AdminUserDto {
  @ApiProperty({ format: 'uuid', description: 'User UUID' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  name: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ enum: Role, enumName: 'Role', description: 'User role' })
  role: Role;
}

export class ListUsersResponseDto extends ListResponse(AdminUserListItemDto) {}
export class UpdateRoleResponseDto extends ApiResponse(AdminUserDto) {}