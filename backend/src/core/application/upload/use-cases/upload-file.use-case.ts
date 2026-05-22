import { Inject, Injectable } from '@nestjs/common';
import {
  IFILE_STORAGE_SERVICE,
  IFileStorageService,
} from '@shared/abstractions/services/i-file-storage.service';

export interface UploadFileCommand {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
}

export interface UploadFileResult {
  url: string;
}

@Injectable()
export class UploadFileUseCase {
  constructor(
    @Inject(IFILE_STORAGE_SERVICE)
    private readonly fileStorageService: IFileStorageService,
  ) {}

  async execute(command: UploadFileCommand): Promise<UploadFileResult> {
    const fileUrl = await this.fileStorageService.uploadFile(
      command.fileBuffer,
      command.fileName,
      command.mimeType,
    );

    return { url: fileUrl };
  }
}
