import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Type } from '@nestjs/common';

export class PaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}

export interface ApiResponseShape<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function ApiResponse<T>(type: Type<T> | Type<T>[]): Type<ApiResponseShape<T>> {
  class ApiResponseDto {
    @ApiProperty({ example: true })
    success!: boolean;

    @ApiProperty({ type: type as unknown as Function })
    data!: T;

    @ApiPropertyOptional({ description: 'Human-readable message' })
    message?: string;
  }
  return ApiResponseDto as Type<ApiResponseShape<T>>;
}

export interface ListResponseShape<T> {
  success: boolean;
  data: T;
  pagination: PaginationDto;
}

export function ListResponse<T>(type: Type<T> | Type<T>[]): Type<ListResponseShape<T>> {
  class ListResponseDto {
    @ApiProperty({ example: true })
    success!: boolean;

    @ApiProperty({ type: type as unknown as Function })
    data!: T;

    @ApiProperty({ type: PaginationDto })
    pagination!: PaginationDto;
  }
  return ListResponseDto as Type<ListResponseShape<T>>;
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