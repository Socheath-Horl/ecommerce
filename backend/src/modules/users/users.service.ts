import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { PaginationDto } from '@/common/dto/response.dto';
import type { ListUsersQueryDto } from '@/modules/users/dto/list-users-query.dto';
import type { UpdateRoleDto } from '@/modules/users/dto/update-role.dto';
import type { AdminUserDto, AdminUserListItemDto } from '@/modules/users/dto/users.response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListUsersQueryDto,
  ): Promise<{ data: AdminUserListItemDto[]; pagination: PaginationDto }> {
    const { page, limit, search, role } = query;

    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateRole(actorId: string, userId: string, dto: UpdateRoleDto): Promise<AdminUserDto> {
    if (actorId === userId) {
      throw new BadRequestException('Cannot change your own role');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dto.role },
      select: { id: true, name: true, email: true, role: true },
    });
    return updated;
  }
}