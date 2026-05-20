import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import { IFILE_STORAGE_SERVICE, IFileStorageService } from '@shared/abstractions/services/i-file-storage.service';
import { IVIDEO_STREAMING_SERVICE, IVideoStreamingService } from '@shared/abstractions/services/i-video-streaming.service';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Controller({
  path: 'upload',
  version: '1',
})
export class UploadController {
  constructor(
    @Inject(IFILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
    @Inject(IVIDEO_STREAMING_SERVICE)
    private readonly videoStreamingService: IVideoStreamingService,
  ) {}

  @Post('video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No video file uploaded');
    }

    // Write buffer to a temp file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${Date.now()}-${file.originalname}`);
    
    try {
      fs.writeFileSync(tempFilePath, file.buffer);
      
      const result = await this.videoStreamingService.uploadVideo(
        tempFilePath,
        file.originalname
      );
      console.log("upload video result", result);
      
      return result;
    } finally {
      // Clean up temp file
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (err) {
        // ignore
      }
    }
  }

  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileUrl = await this.fileStorageService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    return { url: fileUrl };
  }

  @Get('videos/*')
  async serveVideo(@Req() req: Request, @Res() res: Response) {
    const relativePath = decodeURIComponent(req.path.substring(req.path.indexOf('/videos/') + 8));
    const rootDir = path.resolve(process.cwd(), 'uploads', 'videos');
    const resolvedPath = path.resolve(rootDir, relativePath);
    
    if (!resolvedPath.startsWith(rootDir)) {
      throw new ForbiddenException('Access denied');
    }
    
    if (!fs.existsSync(resolvedPath)) {
      throw new NotFoundException('Video not found');
    }
    
    return res.sendFile(resolvedPath);
  }

  @Get('files/*')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    const relativePath = decodeURIComponent(req.path.substring(req.path.indexOf('/files/') + 7));
    const rootDir = path.resolve(process.cwd(), 'uploads', 'files');
    const resolvedPath = path.resolve(rootDir, relativePath);
    
    if (!resolvedPath.startsWith(rootDir)) {
      throw new ForbiddenException('Access denied');
    }
    
    if (!fs.existsSync(resolvedPath)) {
      throw new NotFoundException('File not found');
    }
    
    return res.sendFile(resolvedPath);
  }
}
