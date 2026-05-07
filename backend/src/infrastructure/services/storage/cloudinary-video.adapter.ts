import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { IVideoStreamingService, VideoUploadResult } from '@shared/abstractions/services/i-video-streaming.service';

@Injectable()
export class CloudinaryVideoAdapter implements IVideoStreamingService {
  private readonly logger = new Logger(CloudinaryVideoAdapter.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadVideo(filePath: string, title: string): Promise<VideoUploadResult> {
    try {
      this.logger.log(`Uploading video: ${title} from ${filePath}`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: `courses/videos/${Date.now()}-${title.replace(/\s+/g, '_')}`,
        chunk_size: 6000000, // 6MB chunks for large files
      });

      return {
        assetId: result.public_id,
        playbackUrl: result.secure_url,
      };
    } catch (error) {
      this.logger.error(`Failed to upload video to Cloudinary: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getPlaybackUrl(assetId: string): Promise<string> {
    try {
      return cloudinary.url(assetId, {
        resource_type: 'video',
        secure: true,
      });
    } catch (error) {
      this.logger.error(`Failed to get playback URL from Cloudinary: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteVideo(assetId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(assetId, {
        resource_type: 'video',
      });
    } catch (error) {
      this.logger.error(`Failed to delete video from Cloudinary: ${error.message}`, error.stack);
      throw error;
    }
  }
}
