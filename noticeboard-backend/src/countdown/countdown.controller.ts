import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CountdownService } from './countdown.service';
import { NoticeboardGateway } from '../shared/websocket/noticeboard.gateway';

@ApiTags('countdown')
@ApiBearerAuth()
@Controller('countdown')
export class CountdownController {
  constructor(
    private countdownService: CountdownService,
    private noticeboardGateway: NoticeboardGateway,
  ) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active countdown' })
  getActiveCountdown() {
    return this.countdownService.getActiveCountdown();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all countdowns' })
  getAllCountdowns() {
    return this.countdownService.getAllCountdowns();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new countdown' })
  async createCountdown(@Body() data: { name: string; targetDate: string }) {
    const countdown = await this.countdownService.createCountdown(
      data.name,
      new Date(data.targetDate),
    );
    const active = await this.countdownService.getActiveCountdown();
    this.noticeboardGateway.emitCountdownUpdate(active);
    return countdown;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update countdown' })
  async updateCountdown(
    @Param('id') id: number,
    @Body() data: { name?: string; targetDate?: string; active?: boolean },
  ) {
    const countdown = await this.countdownService.updateCountdown(id, {
      ...data,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
    });
    const active = await this.countdownService.getActiveCountdown();
    this.noticeboardGateway.emitCountdownUpdate(active);
    return countdown;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete countdown' })
  async deleteCountdown(@Param('id') id: number) {
    await this.countdownService.deleteCountdown(id);
    const active = await this.countdownService.getActiveCountdown();
    this.noticeboardGateway.emitCountdownUpdate(active);
    return { success: true };
  }
}
