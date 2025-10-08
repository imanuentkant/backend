import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { MinioFileStorageAdapter } from '@infrastructure/adapter/storage/MinioFileStorageAdapter';
import { S3FileStorageAdapter } from '@infrastructure/adapter/storage/S3FileStorageAdapter';
import { GoogleCloudStorageAdapter } from '@infrastructure/adapter/storage/GoogleCloudStorageAdapter';
import { FileStorageFactory } from '@infrastructure/adapter/storage/FileStorageFactory';

/**
 * Storage Module - File storage abstraction
 * 
 * Hiện tại: MinIO
 * Tương lai: Dễ dàng đổi sang S3, GCS, Azure
 * 
 * Cách đổi storage:
 * 1. Set FILE_STORAGE_PROVIDER=s3 (hoặc gcs, azure)
 * 2. Update credentials trong env
 * 3. Restart application
 * 
 * Không cần thay đổi code!
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // Storage adapters
    MinioFileStorageAdapter,
    S3FileStorageAdapter,
    GoogleCloudStorageAdapter,
    
    // Factory
    FileStorageFactory,
    
    // Provide FileStorage token
    {
      provide: CoreDITokens.FileStorage,
      useFactory: (factory: FileStorageFactory) => factory.getStorage(),
      inject: [FileStorageFactory],
    },
  ],
  exports: [
    CoreDITokens.FileStorage,
    FileStorageFactory,
  ],
})
export class StorageModule {}

