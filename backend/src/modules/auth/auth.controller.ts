import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/auth.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new customer account' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'Account created — returns user + access/refresh tokens' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return { success: true, data: await this.authService.register(dto) };
  }
}