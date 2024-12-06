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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScheduleService } from './schedule.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { NoticeboardGateway } from '../shared/websocket/noticeboard.gateway';

@ApiTags('schedule')
@ApiBearerAuth()
@Controller('schedule')
export class ScheduleController {
  constructor(
    private scheduleService: ScheduleService,
    private noticeboardGateway: NoticeboardGateway,
  ) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's schedule" })
  @ApiResponse({ type: [Schedule] })
  async getTodaySchedule() {
    return this.scheduleService.getTodaySchedule();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all schedules' })
  @ApiResponse({ type: [Schedule] })
  async getSchedules() {
    return this.scheduleService.getSchedules();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create schedule' })
  @ApiResponse({ type: Schedule })
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    const schedule =
      await this.scheduleService.createSchedule(createScheduleDto);
    const todaySchedule = await this.scheduleService.getTodaySchedule();
    this.noticeboardGateway.emitScheduleUpdate(todaySchedule);
    return schedule;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateSchedule(
    @Param('id') id: number,
    @Body() updateScheduleDto: CreateScheduleDto,
  ) {
    const schedule = await this.scheduleService.updateSchedule(
      id,
      updateScheduleDto,
    );
    const todaySchedule = await this.scheduleService.getTodaySchedule();
    this.noticeboardGateway.emitScheduleUpdate(todaySchedule);
    return schedule;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete schedule' })
  async deleteSchedule(@Param('id') id: number) {
    await this.scheduleService.deleteSchedule(id);
    const todaySchedule = await this.scheduleService.getTodaySchedule();
    this.noticeboardGateway.emitScheduleUpdate(todaySchedule);
    return { success: true };
  }
}
