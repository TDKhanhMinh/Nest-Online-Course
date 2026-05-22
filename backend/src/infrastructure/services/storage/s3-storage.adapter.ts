import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IFileStorageService } from '@shared/abstractions/services/i-file-storage.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class S3StorageAdapter implements IFileStorageService {
  private readonly logger = new Logger(S3StorageAdapter.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly isFallback: boolean;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!accessKeyId || !secretAccessKey || !bucketName) {
      this.isFallback = true;
      this.logger.warn(
        'AWS S3 credentials or bucket name missing. File storage will fall back to local storage.',
      );
    } else {
      this.isFallback = false;
      this.region = this.configService.get<string>('AWS_REGION', 'us-east-1');
      this.bucketName = bucketName;

      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    try {
      if (this.isFallback) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'files');
        fs.mkdirSync(uploadDir, { recursive: true });

        // Ensure safe file name
        const safeName = fileName.replace(/\s+/g, '_');
        const destination = path.join(uploadDir, safeName);

        // Ensure directory of files inside destination exists (e.g. certificates/)
        const dir = path.dirname(destination);
        if (dir !== uploadDir) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(destination, fileBuffer);

        const port = this.configService.get<string>('PORT', '5000');
        return `http://localhost:${port}/api/v1/upload/files/${safeName}`;
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      });

      await this.s3Client.send(command);

      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (this.isFallback) {
        // e.g. http://localhost:5000/api/v1/upload/files/certificates/CERT-123.pdf
        const urlParts = fileUrl.split('/files/');
        if (urlParts.length > 1) {
          const relativePath = decodeURIComponent(urlParts[1]);
          const filePath = path.join(
            process.cwd(),
            'uploads',
            'files',
            relativePath,
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return;
      }

      const fileName = fileUrl.split('/').pop();
      if (!fileName) return;

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
      });

      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw error;
    }
  }
}
