import { Injectable, Logger } from '@nestjs/common';
import { IFileStorageService } from '@shared/abstractions/services/i-file-storage.service';

/**
 * AWS S3 adapter implementing IFileStorageService.
 * Replace method bodies with actual AWS SDK calls in production.
 */
@Injectable()
export class S3FileStorageAdapter implements IFileStorageService {
  private readonly logger = new Logger(S3FileStorageAdapter.name);
  private readonly bucket = process.env.S3_BUCKET ?? 'online-learning-certs';

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    this.logger.log(`[S3] Uploading ${fileName} (${mimeType}) to bucket ${this.bucket}`);
    // TODO: s3.putObject({ Bucket, Key, Body, ContentType })
    return `https://${this.bucket}.s3.amazonaws.com/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    this.logger.log(`[S3] Deleting file: ${fileUrl}`);
    // TODO: s3.deleteObject({ ... })
  }
}



