import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;
}
