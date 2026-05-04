import { Injectable, Logger } from '@nestjs/common';
import {
  IVideoStreamingService,
  VideoUploadResult,
} from '../../application/ports/video-streaming.service.interface';

/**
 * Adapter for Mux video platform.
 * Implements IVideoStreamingService (Application port) – Dependency Inversion.
 * In production, inject Mux SDK here.
 */
@Injectable()
export class MuxVideoStreamingAdapter implements IVideoStreamingService {
  private readonly logger = new Logger(MuxVideoStreamingAdapter.name);

  async uploadVideo(filePath: string, title: string): Promise<VideoUploadResult> {
    this.logger.log(`[Mux] Uploading video: ${title} from ${filePath}`);
    // TODO: Replace with actual Mux SDK call
    return {
      assetId: `mux-asset-${Date.now()}`,
      playbackUrl: `https://stream.mux.com/placeholder.m3u8`,
    };
  }

  async getPlaybackUrl(assetId: string): Promise<string> {
    return `https://stream.mux.com/${assetId}.m3u8`;
  }

  async deleteVideo(assetId: string): Promise<void> {
    this.logger.log(`[Mux] Deleting video asset: ${assetId}`);
  }
}
