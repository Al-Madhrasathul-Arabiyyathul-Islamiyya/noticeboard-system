import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VideoService } from '../video/video.service';
import { NoticeboardGateway } from '../shared/websocket/noticeboard.gateway';
import { VideoDto } from './dto/video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@ApiTags('videos')
@ApiBearerAuth()
@Controller('videos')
export class VideoController {
  constructor(
    private videoService: VideoService,
    private noticeboardGateway: NoticeboardGateway,
  ) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all videos (admin)' })
  @ApiResponse({ type: [VideoDto] })
  async getAllVideos() {
    return this.videoService.getVideos();
  }

  @Get()
  @ApiOperation({ summary: 'Get all active videos' })
  @ApiResponse({ type: [VideoDto] })
  async getActiveVideos() {
    return this.videoService.getActiveVideos();
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a new video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['video'],
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Video file (mp4, webm)',
        },
      },
    },
  })
  @ApiResponse({ type: VideoDto })
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(mp4|webm)$/)) {
          return cb(new Error('Only mp4 and webm files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    const video = await this.videoService.addVideo(
      file.originalname,
      file.path,
    );
    await this.emitVideoUpdate();
    return video;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update video active state and order' })
  @ApiResponse({ type: VideoDto })
  async updateVideo(
    @Param('id') id: number,
    @Body() updateData: UpdateVideoDto,
  ) {
    const video = await this.videoService.updateVideo(
      id,
      updateData.active,
      updateData.order,
    );
    await this.emitVideoUpdate();
    return video;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a video' })
  @ApiResponse({ status: 200, description: 'Video deleted successfully' })
  async deleteVideo(@Param('id') id: number) {
    await this.videoService.deleteVideo(id);
    await this.emitVideoUpdate();
    return { success: true };
  }

  private async emitVideoUpdate() {
    const videos = await this.videoService.getActiveVideos();
    this.noticeboardGateway.emitVideoUpdate(videos);
  }
}
