import { ApiProperty } from '@nestjs/swagger';

export class Schedule {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: ['academic', 'administration'] })
  type: 'academic' | 'administration';

  @ApiProperty()
  date: Date;

  @ApiProperty()
  time: string;

  @ApiProperty()
  item: string;
}
