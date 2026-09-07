import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorDto {
  @ApiProperty({ description: 'HTTP status code', example: 401 })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Invalid credentials' })
  message: string;

  @ApiPropertyOptional({ description: 'Error category', example: 'Unauthorized' })
  error?: string;
}