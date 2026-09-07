import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Type } from '@nestjs/common';

export interface ApiResponseShape<T> {
  success: boolean;
  data: T;
}

export function ApiResponse<T>(type: Type<T>): Type<ApiResponseShape<T>> {
  class ApiResponseDto {
    @ApiProperty({ example: true })
    success!: boolean;

    @ApiProperty({ type })
    data!: T;
  }
  return ApiResponseDto as Type<ApiResponseShape<T>>;
}

export class ApiErrorDto {
  @ApiProperty({ description: 'HTTP status code', example: 401 })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Invalid credentials' })
  message: string;

  @ApiPropertyOptional({ description: 'Error category', example: 'Unauthorized' })
  error?: string;
}