import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVideoStreamingService, VideoUploadResult } from '@shared/abstractions/services/i-video-streaming.service';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CloudinaryVideoAdapter implements IVideoStreamingService {
  private readonly logger = new Logger(CloudinaryVideoAdapter.name);
  private readonly isFallback: boolean;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.isFallback = true;
      this.logger.warn('Cloudinary credentials missing. Video streaming will fall back to local storage.');
    } else {
      this.isFallback = false;
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  async uploadVideo(filePath: string, title: string): Promise<VideoUploadResult> {
    try {
      this.logger.log(`Uploading video: ${title} from ${filePath}`);
      if (this.isFallback) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
        fs.mkdirSync(uploadDir, { recursive: true });

        const ext = path.extname(filePath) || '.mp4';
        const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${Date.now()}-${safeTitle}${ext}`;
        const destination = path.join(uploadDir, filename);

        fs.copyFileSync(filePath, destination);

        const port = this.configService.get<string>('PORT', '5000');
        const playbackUrl = `http://localhost:${port}/api/v1/upload/videos/${filename}`;

        return {
          assetId: filename,
          playbackUrl,
        };
      }

      // Upload directly using SDK (no need for node-file-manager)
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: `courses/videos/${Date.now()}-${title.replace(/\s+/g, '_')}`,
        chunk_size: 6000000, 
      });

      return {
        assetId: result.public_id,
        playbackUrl: result.secure_url,
      };
    } catch (error) {
      this.logger.error(`Failed to upload video: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getPlaybackUrl(assetId: string): Promise<string> {
    try {
      if (this.isFallback) {
        const port = this.configService.get<string>('PORT', '5000');
        return `http://localhost:${port}/api/v1/upload/videos/${assetId}`;
      }

      return cloudinary.url(assetId, {
        resource_type: 'video',
        secure: true,
      });
    } catch (error) {
      this.logger.error(`Failed to get playback URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteVideo(assetId: string): Promise<void> {
    try {
      if (this.isFallback) {
        const filePath = path.join(process.cwd(), 'uploads', 'videos', assetId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return;
      }

      await cloudinary.uploader.destroy(assetId, {
        resource_type: 'video',
      });
    } catch (error) {
      this.logger.error(`Failed to delete video: ${error.message}`, error.stack);
      throw error;
    }
  }
}

