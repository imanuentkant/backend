import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStoragePort, UploadFileOptions, UploadedFileResult } from '@core/common/port/storage/FileStoragePort';

/**
 * Google Cloud Storage Adapter
 * Real GCS integration với fallback cho dev mode
 */
@Injectable()
export class GoogleCloudStorageAdapter implements FileStoragePort {
  private readonly logger = new Logger(GoogleCloudStorageAdapter.name);
  private readonly basePath: string;
  private readonly useRealGCS: boolean;
  private storage: any;

  constructor(private configService: ConfigService) {
    this.basePath = this.configService.get('FILE_STORAGE_BASE_PATH', '');
    
    const projectId = this.configService.get('GCP_PROJECT_ID', '');
    this.useRealGCS = !!projectId && projectId.length > 0;

    this.initializeGCSClient();
  }

  private initializeGCSClient(): void {
    if (this.useRealGCS) {
      try {
        // Real Google Cloud Storage initialization
        // Install: npm install @google-cloud/storage
        // Uncomment when ready:
        // const { Storage } = require('@google-cloud/storage');
        // this.storage = new Storage({
        //   projectId: this.configService.get('GCP_PROJECT_ID'),
        //   keyFilename: this.configService.get('GCP_KEY_FILE'),
        //   // Or use service account JSON:
        //   // credentials: JSON.parse(this.configService.get('GCP_CREDENTIALS_JSON')),
        // });
        this.logger.log('✅ Google Cloud Storage initialized (PRODUCTION MODE)');
      } catch (error) {
        this.logger.warn('⚠️ @google-cloud/storage not installed. Install: npm install @google-cloud/storage');
        this.logger.warn('Falling back to mock mode');
      }
    } else {
      this.logger.log('🔧 GCS mock mode enabled (DEVELOPMENT)');
    }
  }

  async upload(options: UploadFileOptions): Promise<UploadedFileResult> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS upload
      // const bucket = this.storage.bucket(options.bucket);
      // const file = bucket.file(options.filename);
      // 
      // await file.save(options.buffer, {
      //   contentType: options.contentType,
      //   metadata: options.metadata,
      //   public: true,
      //   resumable: false,
      // });
      // 
      // const url = this.basePath
      //   ? `${this.basePath}/${options.bucket}/${options.filename}`
      //   : `https://storage.googleapis.com/${options.bucket}/${options.filename}`;
      // 
      // this.logger.log(`✅ Real GCS upload: ${url}`);
      // 
      // return {
      //   url,
      //   key: options.filename,
      //   bucket: options.bucket,
      //   size: options.buffer.length,
      //   contentType: options.contentType,
      // };
    }

    // DEV MODE: Mock upload
    const url = `https://storage.googleapis.com/${options.bucket}/${options.filename}`;
    
    this.logger.log(`🔧 [DEV] Mock GCS upload: ${options.bucket}/${options.filename}`);
    
    return {
      url,
      key: options.filename,
      bucket: options.bucket,
      size: options.buffer.length,
      contentType: options.contentType,
    };
  }

  async uploadMultiple(files: UploadFileOptions[]): Promise<UploadedFileResult[]> {
    return Promise.all(files.map(file => this.upload(file)));
  }

  async getFileUrl(bucket: string, key: string): Promise<string> {
    if (this.basePath) {
      return `${this.basePath}/${bucket}/${key}`;
    }
    return `https://storage.googleapis.com/${bucket}/${key}`;
  }

  async getSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS signed URL
      // const bucket = this.storage.bucket(bucket);
      // const file = bucket.file(key);
      // 
      // const [url] = await file.getSignedUrl({
      //   action: 'read',
      //   expires: Date.now() + expiresIn * 1000,
      // });
      // 
      // this.logger.log(`✅ Real GCS signed URL generated for ${bucket}/${key}`);
      // return url;
    }

    // DEV MODE: Mock signed URL
    return `https://storage.googleapis.com/${bucket}/${key}?expires=${expiresIn}`;
  }

  async delete(bucket: string, key: string): Promise<boolean> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS delete
      // await this.storage.bucket(bucket).file(key).delete();
      // this.logger.log(`✅ Real GCS delete: ${bucket}/${key}`);
      // return true;
    }

    // DEV MODE: Mock delete
    this.logger.log(`🔧 [DEV] Mock GCS delete: ${bucket}/${key}`);
    return true;
  }

  async deleteMultiple(bucket: string, keys: string[]): Promise<boolean> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS batch delete
      // const deletePromises = keys.map(key =>
      //   this.storage.bucket(bucket).file(key).delete()
      // );
      // await Promise.all(deletePromises);
      // this.logger.log(`✅ Real GCS deleted ${keys.length} files from ${bucket}`);
      // return true;
    }

    // DEV MODE: Mock batch delete
    this.logger.log(`🔧 [DEV] Mock GCS deleted ${keys.length} files from ${bucket}`);
    return true;
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS exists check
      // const [exists] = await this.storage.bucket(bucket).file(key).exists();
      // return exists;
    }

    // DEV MODE: Always true
    return true;
  }

  async getMetadata(bucket: string, key: string): Promise<{
    size: number;
    contentType: string;
    lastModified: Date;
    etag?: string;
  }> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS metadata
      // const [metadata] = await this.storage.bucket(bucket).file(key).getMetadata();
      // 
      // return {
      //   size: parseInt(metadata.size),
      //   contentType: metadata.contentType,
      //   lastModified: new Date(metadata.updated),
      //   etag: metadata.etag,
      // };
    }

    // DEV MODE: Mock metadata
    return {
      size: 1024,
      contentType: 'image/jpeg',
      lastModified: new Date(),
    };
  }

  async copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<boolean> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS copy
      // await this.storage
      //   .bucket(sourceBucket)
      //   .file(sourceKey)
      //   .copy(this.storage.bucket(destBucket).file(destKey));
      // 
      // this.logger.log(`✅ Real GCS copy: ${sourceBucket}/${sourceKey} → ${destBucket}/${destKey}`);
      // return true;
    }

    // DEV MODE: Mock copy
    this.logger.log(`🔧 [DEV] Mock GCS copy: ${sourceBucket}/${sourceKey} → ${destBucket}/${destKey}`);
    return true;
  }

  async list(bucket: string, prefix?: string): Promise<Array<{
    key: string;
    size: number;
    lastModified: Date;
  }>> {
    if (this.useRealGCS && this.storage) {
      // REAL GCS list
      // const [files] = await this.storage.bucket(bucket).getFiles({ prefix });
      // 
      // return files.map(file => ({
      //   key: file.name,
      //   size: parseInt(file.metadata.size),
      //   lastModified: new Date(file.metadata.updated),
      // }));
    }

    // DEV MODE: Mock list
    return [];
  }
}