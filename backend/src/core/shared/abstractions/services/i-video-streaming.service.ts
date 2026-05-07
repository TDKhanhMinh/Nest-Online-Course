export interface VideoUploadResult {
  assetId: string;
  playbackUrl: string;
}

export interface IVideoStreamingService {
  uploadVideo(filePath: string, title: string): Promise<VideoUploadResult>;
  getPlaybackUrl(assetId: string): Promise<string>;
  deleteVideo(assetId: string): Promise<void>;
}

export const IVIDEO_STREAMING_SERVICE = Symbol('IVideoStreamingService');



