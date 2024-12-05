import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Res,
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
import { Response as ExpressResponse } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VideoService } from '../video/video.service';
import { NoticeboardGateway } from '../shared/websocket/noticeboard.gateway';
import { VideoDto } from './dto/video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { join } from 'path';
import * as fs from 'fs';
import { createReadStream, statSync } from 'fs';

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

  @Get('stream/:filename')
  @ApiOperation({ summary: 'Stream video file' })
  async streamVideo(
    @Param('filename') filename: string,
    @Headers() headers,
    @Res() res: ExpressResponse,
  ) {
    try {
      const videoPath = join(process.cwd(), 'uploads', filename);

      try {
        await fs.promises.access(videoPath, fs.constants.F_OK);
      } catch {
        res.status(404).json({ message: 'Video not found' });
        return;
      }

      const { size } = statSync(videoPath);
      const range = headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

        if (start >= size || start >= end || end > size - 1) {
          res.status(416).send('Requested range not satisfiable');
          return;
        }

        res
          .status(206)
          .header('Content-Range', `bytes ${start}-${end}/${size}`)
          .header('Accept-Ranges', 'bytes')
          .header('Content-Length', String(end - start + 1))
          .header('Content-Type', 'video/mp4');

        const stream = createReadStream(videoPath, { start, end });
        stream.pipe(res);

        stream.on('error', () => {
          res.status(500).json({ message: 'Error streaming video' });
        });
      } else {
        res
          .status(200)
          .header('Content-Length', String(size))
          .header('Content-Type', 'video/mp4');

        const stream = createReadStream(videoPath);
        stream.pipe(res);

        stream.on('error', () => {
          res.status(500).json({ message: 'Error streaming video' });
        });
      }
    } catch (error) {
      console.error('Video streaming error:', error);
      res.status(500).json({ message: 'Server error while streaming video' });
    }
  }

  private async emitVideoUpdate() {
    const videos = await this.videoService.getActiveVideos();
    this.noticeboardGateway.emitVideoUpdate(videos);
  }
}
