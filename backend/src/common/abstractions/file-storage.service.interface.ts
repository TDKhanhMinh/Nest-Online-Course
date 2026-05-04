export interface IFileStorageService {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}

export const FILE_STORAGE_SERVICE = Symbol('IFileStorageService');
