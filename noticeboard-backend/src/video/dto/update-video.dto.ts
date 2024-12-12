// src/video/dto/update-video.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVideoDto {
  @ApiPropertyOptional({ example: true })
  active?: boolean;

  @ApiPropertyOptional({ example: 1 })
  order?: number;
}
