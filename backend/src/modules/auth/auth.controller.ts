import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/auth.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import {
  AuthResponseDto,
  LogoutResponseDto,
  RefreshResponseDto,
} from '@/modules/auth/dto/auth-response.dto';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { RefreshTokenDto } from '@/modules/auth/dto/refresh-token.dto';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { ApiErrorDto } from '@/common/dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new customer account' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthResponseDto, description: 'Account created — returns user + access/refresh tokens' })
  @ApiBadRequestResponse({ type: ApiErrorDto, description: 'Validation error' })
  @ApiConflictResponse({ type: ApiErrorDto, description: 'Email already exists' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return { success: true, data: await this.authService.register(dto) };
  }

  @ApiOperation({ summary: 'Sign in with email + password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto, description: 'Authenticated — returns user + access/refresh tokens' })
  @ApiBadRequestResponse({ type: ApiErrorDto, description: 'Validation error' })
  @ApiUnauthorizedResponse({ type: ApiErrorDto, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return { success: true, data: await this.authService.login(dto) };
  }

  @ApiOperation({ summary: 'Sign out — invalidates the refresh token (client clears storage)' })
  @ApiBearerAuth()
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: LogoutResponseDto, description: 'Logged out successfully' })
  @ApiUnauthorizedResponse({ type: ApiErrorDto, description: 'Missing/invalid refresh token' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    await this.authService.logout(dto.refreshToken);
    return { success: true, message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'Refresh the token pair — exchange a valid refresh token for new access + refresh tokens' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: RefreshResponseDto, description: 'New access + refresh tokens issued' })
  @ApiUnauthorizedResponse({ type: ApiErrorDto, description: 'Invalid/expired refresh token' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return { success: true, data: await this.authService.refresh(dto.refreshToken) };
  }
}