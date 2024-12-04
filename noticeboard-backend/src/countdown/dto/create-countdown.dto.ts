import { ApiProperty } from '@nestjs/swagger';

export class CreateCountdownDto {
  @ApiProperty({ example: 'Summer Break' })
  name: string;

  @ApiProperty({ example: '2024-06-01T00:00:00.000Z' })
  targetDate: string;
}
