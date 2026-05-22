import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '@application/upload/use-cases/upload-file.use-case';
import { JwtAuthGuard } from '@presentation/web/shared/guards/jwt-auth.guard';
import {
  IVIDEO_STREAMING_SERVICE,
  IVideoStreamingService,
} from '@shared/abstractions/services/i-video-streaming.service';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

@Controller({
  path: 'upload',
  version: '1',
})
export class UploadController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
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
    const tempFilePath = path.join(
      tempDir,
      `${Date.now()}-${file.originalname}`,
    );

    try {
      fs.writeFileSync(tempFilePath, file.buffer);

      const result = await this.videoStreamingService.uploadVideo(
        tempFilePath,
        file.originalname,
      );
      console.log('upload video result', result);

      return result;
    } finally {
      // Clean up temp file
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch {
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

    return this.uploadFileUseCase.execute({
      fileBuffer: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });
  }
}
