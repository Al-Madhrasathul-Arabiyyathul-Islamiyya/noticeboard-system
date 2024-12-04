import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from '../services/video.service';
import { NoticeboardGateway } from '../gateways/noticeboard.gateway';
import * as path from 'path';

import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('videos')
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
  @ApiOperation({ summary: 'Upload a new video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
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
}
