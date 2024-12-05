import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { SystemHealthDto } from './dto/system-health.dto';

@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Get('health')
  @ApiResponse({
    description: 'Get system health status',
    type: SystemHealthDto,
  })
  getHealth() {
    return this.systemService.getSystemHealth();
  }
}
