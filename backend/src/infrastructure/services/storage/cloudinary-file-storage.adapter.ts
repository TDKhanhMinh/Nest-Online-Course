import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFileStorageService } from '@shared/abstractions/services/i-file-storage.service';
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import * as path from 'path';

@Injectable()
export class CloudinaryFileStorageAdapter implements IFileStorageService {
  private readonly logger = new Logger(CloudinaryFileStorageAdapter.name);
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.isConfigured = false;
      this.logger.warn(
        'Cloudinary credentials missing. File uploads require Cloudinary configuration.',
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

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    try {
      this.assertConfigured();

      const safePath = this.toSafePath(fileName);
      const safeFileName = path.basename(safePath);
      const folderPath = path.dirname(safePath);
      const publicId = `${Date.now()}-${path.basename(
        safeFileName,
        path.extname(safeFileName),
      )}`;
      const folder =
        folderPath === '.'
          ? 'courses/files'
          : `courses/files/${folderPath.replace(/\\/g, '/')}`;

      const result = await this.uploadBuffer(fileBuffer, {
        folder,
        publicId,
        mimeType,
      });

      return result.secure_url;
    } catch (error) {
      this.logError('upload file', error);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      this.assertConfigured();

      const publicIds = this.extractCloudinaryPublicIds(fileUrl);
      const resourceTypes: Array<'image' | 'raw' | 'video'> = [
        'image',
        'raw',
        'video',
      ];

      await Promise.allSettled(
        publicIds.flatMap((publicId) =>
          resourceTypes.map((resourceType) =>
            cloudinary.uploader.destroy(publicId, {
              resource_type: resourceType,
            }),
          ),
        ),
      );
    } catch (error) {
      this.logError('delete file', error);
      throw error;
    }
  }

  private async uploadBuffer(
    fileBuffer: Buffer,
    options: {
      folder: string;
      publicId: string;
      mimeType: string;
    },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          public_id: options.publicId,
          resource_type: 'auto',
          type: 'upload',
          use_filename: false,
          unique_filename: false,
          context: {
            mime_type: options.mimeType,
          },
        },
        (error, result) => {
          if (error) {
            reject(this.toError(error));
            return;
          }

          if (!result) {
            reject(new Error('Cloudinary upload returned no result'));
            return;
          }

          resolve(result);
        },
      );

      stream.end(fileBuffer);
    });
  }

  private toSafePath(fileName: string): string {
    const segments = fileName
      .replace(/\\/g, '/')
      .split('/')
      .filter(Boolean)
      .map((segment) => {
        const safeSegment = segment.replace(/[^a-zA-Z0-9._-]/g, '_');
        return safeSegment === '.' || safeSegment === '..' ? '_' : safeSegment;
      });

    return segments.length > 0 ? path.join(...segments) : 'file';
  }

  private extractCloudinaryPublicIds(fileUrl: string): string[] {
    const uploadMarker = '/upload/';
    const uploadIndex = fileUrl.indexOf(uploadMarker);
    if (uploadIndex === -1) {
      return [];
    }

    const pathAfterUpload = fileUrl
      .slice(uploadIndex + uploadMarker.length)
      .split('?')[0]
      .split('/')
      .filter((segment) => !/^v\d+$/.test(segment))
      .join('/');
    const decodedPublicId = decodeURIComponent(pathAfterUpload);
    const withoutExtension = decodedPublicId.replace(/\.[^/.]+$/, '');

    return Array.from(new Set([decodedPublicId, withoutExtension]));
  }

  private assertConfigured(): void {
    if (!this.isConfigured) {
      throw new Error('Cloudinary credentials are required for file uploads.');
    }
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

    if (this.hasMessage(error)) {
      return new Error(error.message);
    }

    return new Error(String(error));
  }

  private hasMessage(error: unknown): error is { message: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
    );
  }
}
