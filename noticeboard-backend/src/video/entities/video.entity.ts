import { ApiProperty } from '@nestjs/swagger';

export class Video {
  @ApiProperty()
  id: number;
  filename: string;
  path: string;
  order: number;
  active: boolean;
  createdAt: Date;
}
