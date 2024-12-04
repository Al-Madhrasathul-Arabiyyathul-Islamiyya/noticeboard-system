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
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VideoService } from '../video/video.service';
import { NoticeboardGateway } from '../shared/websocket/noticeboard.gateway';

@ApiTags('videos')
@ApiBearerAuth()
@Controller('videos')
export class VideoController {
  constructor(
    private videoService: VideoService,
    private noticeboardGateway: NoticeboardGateway,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all active videos' })
  async getVideos() {
    return this.videoService.getActiveVideos();
  }

  @Post('upload')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Upload a new video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Video file (mp4, webm)',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('video', {
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(mp4|webm)$/)) {
          return cb(new Error('Only video files are allowed!'), false);
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

    const videos = await this.videoService.getActiveVideos();
    this.noticeboardGateway.emitVideoUpdate(videos);

    return video;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update video active state and order' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        active: { type: 'boolean' },
        order: { type: 'number' },
      },
    },
  })
  async updateVideo(
    @Param('id') id: number,
    @Body() updateData: { active?: boolean; order?: number },
  ) {
    const video = await this.videoService.updateVideo(
      id,
      updateData.active,
      updateData.order,
    );
    const videos = await this.videoService.getActiveVideos();
    this.noticeboardGateway.emitVideoUpdate(videos);
    return video;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a video' })
  async deleteVideo(@Param('id') id: number) {
    await this.videoService.deleteVideo(id);
    const videos = await this.videoService.getActiveVideos();
    this.noticeboardGateway.emitVideoUpdate(videos);
    return { success: true };
  }
}
