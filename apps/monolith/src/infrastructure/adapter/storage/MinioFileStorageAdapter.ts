import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { FileStoragePort, UploadFileOptions, UploadedFileResult } from '@core/common/port/storage/FileStoragePort';

/**
 * MinIO File Storage Adapter
 * Implementation hiện tại dùng MinIO
 * Có thể dễ dàng thay bằng S3Adapter, GCSAdapter, AzureBlobAdapter
 */
@Injectable()
export class MinioFileStorageAdapter implements FileStoragePort {
  private readonly logger = new Logger(MinioFileStorageAdapter.name);
  private readonly client: Minio.Client;
  private readonly basePath: string;

  constructor(private configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.get('FILE_STORAGE_ENDPOINT', 'localhost'),
      port: parseInt(this.configService.get('FILE_STORAGE_PORT', '9000')),
      useSSL: this.configService.get('FILE_STORAGE_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('FILE_STORAGE_ACCESS_KEY', ''),
      secretKey: this.configService.get('FILE_STORAGE_SECRET_KEY', ''),
    });

    this.basePath = this.configService.get('FILE_STORAGE_BASE_PATH', 'http://localhost:9000');
  }

  /**
   * Upload single file
   */
  async upload(options: UploadFileOptions): Promise<UploadedFileResult> {
    try {
      // Ensure bucket exists
      const bucketExists = await this.client.bucketExists(options.bucket);
      if (!bucketExists) {
        await this.client.makeBucket(options.bucket, 'us-east-1');
        // Set public read policy (nếu cần public access)
        await this.setPublicPolicy(options.bucket);
      }

      // Upload file
      const result = await this.client.putObject(
        options.bucket,
        options.filename,
        options.buffer,
        options.buffer.length,
        {
          'Content-Type': options.contentType,
          ...options.metadata,
        }
      );

      const url = `${this.basePath}/${options.bucket}/${options.filename}`;

      this.logger.log(`File uploaded: ${url}`);

      return {
        url,
        key: options.filename,
        bucket: options.bucket,
        size: options.buffer.length,
        contentType: options.contentType,
        etag: result.etag,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Upload failed: ${err.message}`, err.stack);
      throw new Error(`Failed to upload file: ${err.message}`);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(files: UploadFileOptions[]): Promise<UploadedFileResult[]> {
    return Promise.all(files.map(file => this.upload(file)));
  }

  /**
   * Get public file URL
   */
  async getFileUrl(bucket: string, key: string): Promise<string> {
    return `${this.basePath}/${bucket}/${key}`;
  }

  /**
   * Get signed URL (for private files)
   */
  async getSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(bucket, key, expiresIn);
      return url;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to generate signed URL: ${err.message}`);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Delete file
   */
  async delete(bucket: string, key: string): Promise<boolean> {
    try {
      await this.client.removeObject(bucket, key);
      this.logger.log(`File deleted: ${bucket}/${key}`);
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Delete failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultiple(bucket: string, keys: string[]): Promise<boolean> {
    try {
      await this.client.removeObjects(bucket, keys);
      this.logger.log(`${keys.length} files deleted from ${bucket}`);
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Bulk delete failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Check if file exists
   */
  async exists(bucket: string, key: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, key);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file metadata
   */
  async getMetadata(bucket: string, key: string): Promise<{
    size: number;
    contentType: string;
    lastModified: Date;
    etag?: string;
  }> {
    try {
      const stat = await this.client.statObject(bucket, key);
      return {
        size: stat.size,
        contentType: stat.metaData['content-type'] || 'application/octet-stream',
        lastModified: stat.lastModified,
        etag: stat.etag,
      };
    } catch (error) {
      const err = error as Error;
      throw new Error(`Failed to get metadata: ${err.message}`);
    }
  }

  /**
   * Copy file
   */
  async copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<boolean> {
    try {
      const conditions = new Minio.CopyConditions();
      await this.client.copyObject(destBucket, destKey, `/${sourceBucket}/${sourceKey}`, conditions);
      this.logger.log(`File copied: ${sourceBucket}/${sourceKey} → ${destBucket}/${destKey}`);
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Copy failed: ${err.message}`);
      return false;
    }
  }

  /**
   * List files
   */
  async list(bucket: string, prefix?: string): Promise<Array<{
    key: string;
    size: number;
    lastModified: Date;
  }>> {
    const files: Array<{ key: string; size: number; lastModified: Date }> = [];

    return new Promise((resolve, reject) => {
      const stream = this.client.listObjects(bucket, prefix, true);

      stream.on('data', (obj) => {
        if (obj.name && obj.size && obj.lastModified) {
          files.push({
            key: obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
          });
        }
      });

      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('end', () => {
        resolve(files);
      });
    });
  }

  /**
   * Set public read policy for bucket
   */
  private async setPublicPolicy(bucket: string): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };

    try {
      await this.client.setBucketPolicy(bucket, JSON.stringify(policy));
    } catch (error) {
      const err = error as Error;
      this.logger.warn(`Failed to set public policy: ${err.message}`);
    }
  }
}

