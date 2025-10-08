import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStoragePort } from '@core/common/port/storage/FileStoragePort';
import { MinioFileStorageAdapter } from './MinioFileStorageAdapter';
import { S3FileStorageAdapter } from './S3FileStorageAdapter';

/**
 * File Storage Factory
 * Factory pattern để tự động chọn storage provider
 * 
 * Hiện tại: MinIO
 * Tương lai: Chỉ cần set FILE_STORAGE_PROVIDER=s3 trong env
 */
@Injectable()
export class FileStorageFactory {
  private readonly logger = new Logger(FileStorageFactory.name);
  private storage: FileStoragePort;

  constructor(
    private configService: ConfigService,
    private minioAdapter: MinioFileStorageAdapter,
    private s3Adapter: S3FileStorageAdapter,
  ) {
    const provider = this.configService.get<string>('FILE_STORAGE_PROVIDER', 'minio');
    
    this.storage = this.createStorage(provider);
    this.logger.log(`File storage initialized with provider: ${provider}`);
  }

  /**
   * Get storage instance
   */
  getStorage(): FileStoragePort {
    return this.storage;
  }

  /**
   * Create storage based on provider
   */
  private createStorage(provider: string): FileStoragePort {
    switch (provider.toLowerCase()) {
      case 'minio':
        return this.minioAdapter;
      
      case 's3':
      case 'aws':
        return this.s3Adapter;
      
      case 'gcs':
      case 'google':
        // Future: GoogleCloudStorageAdapter
        this.logger.warn('GCS not implemented yet, falling back to MinIO');
        return this.minioAdapter;
      
      case 'azure':
        // Future: AzureBlobStorageAdapter
        this.logger.warn('Azure Blob not implemented yet, falling back to MinIO');
        return this.minioAdapter;
      
      default:
        this.logger.warn(`Unknown provider: ${provider}, falling back to MinIO`);
        return this.minioAdapter;
    }
  }

  /**
   * Switch storage provider runtime (if needed)
   */
  switchProvider(provider: string): void {
    this.storage = this.createStorage(provider);
    this.logger.log(`Storage provider switched to: ${provider}`);
  }
}

