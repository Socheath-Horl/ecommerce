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

export class ApiErrorDetailDto {
  @ApiProperty({ description: 'Machine-readable error code', example: 'UNAUTHORIZED' })
  code: string;

  @ApiProperty({ description: 'Human-readable error message', example: 'Invalid credentials' })
  message: string;

  @ApiPropertyOptional({ type: [String], description: 'Field-level error details (validation)' })
  details?: string[];
}

export class ApiErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ type: ApiErrorDetailDto })
  error: ApiErrorDetailDto;
}