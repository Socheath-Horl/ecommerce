import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import type { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: await bcrypt.hash(dto.password, 10),
        role: Role.CUSTOMER,
      },
    });
    return this.buildAuthResult(user);
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildAuthResult(user);
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET') ?? 'change-me-refresh',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refresh(refreshToken: string): Promise<Pick<AuthResult, 'accessToken' | 'refreshToken'>> {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET') ?? 'change-me-refresh',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    const { accessToken, refreshToken: newRefreshToken } = await this.buildAuthResult(user);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new UnauthorizedException('Current password incorrect');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: await bcrypt.hash(dto.newPassword, 10) },
    });
  }

  private async buildAuthResult(user: AuthUser): Promise<AuthResult> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET') ?? 'change-me-refresh',
      expiresIn: (this.config.get<string>('REFRESH_TOKEN_EXPIRATION') ?? '7d') as JwtSignOptions['expiresIn'],
    });
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }
}