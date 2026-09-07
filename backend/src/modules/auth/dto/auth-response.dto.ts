import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

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

export class AuthResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: AuthResultDto })
  data: AuthResultDto;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Logged out successfully' })
  message: string;
}