import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ApiResponse } from '@/common/dto/response.dto';

export class AuthUserDto {
  @ApiProperty({ format: 'uuid', description: 'User UUID' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  name: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ enum: Role, enumName: 'Role', description: 'User role' })
  role: Role;
}

export class AuthResultDto {
  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;

  @ApiProperty({ description: 'Short-lived access token (sent as Bearer)' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token (client stores in localStorage)' })
  refreshToken: string;
}

export class AuthResponseDto extends ApiResponse(AuthResultDto) {}

export class RefreshDataDto {
  @ApiProperty({ description: 'Short-lived access token (sent as Bearer)' })
  accessToken: string;

  @ApiProperty({ description: 'New refresh token (issued on rotation)' })
  refreshToken: string;
}

export class RefreshResponseDto extends ApiResponse(RefreshDataDto) {}

export class ProfileResponseDto extends ApiResponse(AuthUserDto) {}

export class MessageResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Logged out successfully' })
  message: string;
}