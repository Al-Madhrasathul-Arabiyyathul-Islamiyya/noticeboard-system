import { ApiProperty } from '@nestjs/swagger';

export class Countdown {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  targetDate: Date;

  @ApiProperty()
  active: boolean;
}
