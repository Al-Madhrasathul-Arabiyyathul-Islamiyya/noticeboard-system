import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ enum: ['academic', 'administration'] })
  type: 'academic' | 'administration';

  @ApiProperty({ example: '2024-12-04' })
  date: string;

  @ApiProperty({ example: '09:00' })
  time: string;

  @ApiProperty({ example: 'Morning Assembly' })
  item: string;
}
