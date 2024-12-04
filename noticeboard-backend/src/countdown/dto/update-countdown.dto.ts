import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCountdownDto {
  @ApiPropertyOptional({ example: 'Summer Break' })
  name?: string;

  @ApiPropertyOptional({ example: '2024-06-01T00:00:00.000Z' })
  targetDate?: string;

  @ApiPropertyOptional({ example: true })
  active?: boolean;
}
