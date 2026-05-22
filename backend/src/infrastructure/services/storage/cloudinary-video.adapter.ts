import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IVideoStreamingService,
  VideoUploadResult,
} from '@shared/abstractions/services/i-video-streaming.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryVideoAdapter implements IVideoStreamingService {
  private readonly logger = new Logger(CloudinaryVideoAdapter.name);
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.isConfigured = false;
      this.logger.warn(
        'Cloudinary credentials missing. Video uploads require Cloudinary configuration.',
      );
    } else {
      this.isConfigured = true;
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  async uploadVideo(
    filePath: string,
    title: string,
  ): Promise<VideoUploadResult> {
    try {
      this.assertConfigured();
      this.logger.log(`Uploading video: ${title} from ${filePath}`);

      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        public_id: `courses/videos/${Date.now()}-${this.toSafePublicId(title)}`,
        chunk_size: 6000000,
      });

      return {
        assetId: result.public_id,
        playbackUrl: result.secure_url,
      };
    } catch (error) {
      this.logError('upload video', error);
      throw error;
    }
  }

  getPlaybackUrl(assetId: string): Promise<string> {
    try {
      this.assertConfigured();

      return Promise.resolve(
        cloudinary.url(assetId, {
          resource_type: 'video',
          secure: true,
        }),
      );
    } catch (error) {
      this.logError('get playback URL', error);
      throw error;
    }
  }

  async deleteVideo(assetId: string): Promise<void> {
    try {
      this.assertConfigured();

      await cloudinary.uploader.destroy(assetId, {
        resource_type: 'video',
      });
    } catch (error) {
      this.logError('delete video', error);
      throw error;
    }
  }

  private assertConfigured(): void {
    if (!this.isConfigured) {
      throw new Error('Cloudinary credentials are required for video uploads.');
    }
  }

  private toSafePublicId(value: string): string {
    return value.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private logError(action: string, error: unknown): void {
    const normalizedError = this.toError(error);
    this.logger.error(
      `Failed to ${action}: ${normalizedError.message}`,
      normalizedError.stack,
    );
  }

  private toError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    ) {
      return new Error((error as { message: string }).message);
    }

    return new Error(String(error));
  }
}
