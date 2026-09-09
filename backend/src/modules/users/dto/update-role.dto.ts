import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { Role } from '@prisma/client';

const ROLE_OPTIONS = [Role.CUSTOMER, Role.USER, Role.ADMIN] as const;
type RoleOption = (typeof ROLE_OPTIONS)[number];

export class UpdateRoleDto {
  @ApiProperty({ enum: ROLE_OPTIONS, description: 'New role for the user' })
  @IsIn(ROLE_OPTIONS, { message: 'role must be one of: CUSTOMER, USER, ADMIN' })
  role!: RoleOption;
}