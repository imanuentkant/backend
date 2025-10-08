import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStoragePort, UploadFileOptions, UploadedFileResult } from '@core/common/port/storage/FileStoragePort';

/**
 * AWS S3 File Storage Adapter
 * Implementation cho AWS S3 - tương lai có thể enable
 * 
 * To use:
 * 1. npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 * 2. Set FILE_STORAGE_PROVIDER=s3 in env
 * 3. Configure AWS credentials
 */
@Injectable()
export class S3FileStorageAdapter implements FileStoragePort {
  private readonly logger = new Logger(S3FileStorageAdapter.name);
  // private readonly s3Client: S3Client;
  private readonly region: string;
  private readonly basePath: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get('AWS_REGION', 'us-east-1');
    this.basePath = this.configService.get('FILE_STORAGE_BASE_PATH', '');

    // Real implementation (khi cài @aws-sdk/client-s3):
    // import { S3Client } from '@aws-sdk/client-s3';
    // this.s3Client = new S3Client({
    //   region: this.region,
    //   credentials: {
    //     accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    //     secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    //   },
    // });
  }

  async upload(options: UploadFileOptions): Promise<UploadedFileResult> {
    this.logger.log(`[S3] Uploading: ${options.bucket}/${options.filename}`);

    // Real implementation:
    // import { PutObjectCommand } from '@aws-sdk/client-s3';
    // 
    // const command = new PutObjectCommand({
    //   Bucket: options.bucket,
    //   Key: options.filename,
    //   Body: options.buffer,
    //   ContentType: options.contentType,
    //   Metadata: options.metadata,
    //   ACL: 'public-read', // hoặc 'private'
    // });
    // 
    // const result = await this.s3Client.send(command);
    // 
    // const url = this.basePath 
    //   ? `${this.basePath}/${options.bucket}/${options.filename}`
    //   : `https://${options.bucket}.s3.${this.region}.amazonaws.com/${options.filename}`;
    // 
    // return {
    //   url,
    //   key: options.filename,
    //   bucket: options.bucket,
    //   size: options.buffer.length,
    //   contentType: options.contentType,
    //   etag: result.ETag,
    // };

    // Mock implementation (cho khi chưa có AWS account)
    const url = `https://${options.bucket}.s3.${this.region}.amazonaws.com/${options.filename}`;
    
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
    // CloudFront URL nếu có CDN
    if (this.basePath) {
      return `${this.basePath}/${bucket}/${key}`;
    }
    return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async getSignedUrl(bucket: string, key: string, expiresIn: number = 3600): Promise<string> {
    // Real implementation:
    // import { GetObjectCommand } from '@aws-sdk/client-s3';
    // import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
    // 
    // const command = new GetObjectCommand({
    //   Bucket: bucket,
    //   Key: key,
    // });
    // 
    // return await getSignedUrl(this.s3Client, command, { expiresIn });

    // Mock
    return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}?X-Amz-Expires=${expiresIn}`;
  }

  async delete(bucket: string, key: string): Promise<boolean> {
    // Real implementation:
    // import { DeleteObjectCommand } from '@aws-sdk/client-s3';
    // 
    // const command = new DeleteObjectCommand({
    //   Bucket: bucket,
    //   Key: key,
    // });
    // 
    // await this.s3Client.send(command);
    
    this.logger.log(`[S3] Deleted: ${bucket}/${key}`);
    return true;
  }

  async deleteMultiple(bucket: string, keys: string[]): Promise<boolean> {
    // Real implementation:
    // import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
    // 
    // const command = new DeleteObjectsCommand({
    //   Bucket: bucket,
    //   Delete: {
    //     Objects: keys.map(key => ({ Key: key })),
    //   },
    // });
    // 
    // await this.s3Client.send(command);
    
    this.logger.log(`[S3] Deleted ${keys.length} files from ${bucket}`);
    return true;
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    // Real implementation:
    // import { HeadObjectCommand } from '@aws-sdk/client-s3';
    // 
    // try {
    //   const command = new HeadObjectCommand({
    //     Bucket: bucket,
    //     Key: key,
    //   });
    //   await this.s3Client.send(command);
    //   return true;
    // } catch (error) {
    //   return false;
    // }

    return true; // Mock
  }

  async getMetadata(bucket: string, key: string): Promise<{
    size: number;
    contentType: string;
    lastModified: Date;
    etag?: string;
  }> {
    // Real implementation:
    // import { HeadObjectCommand } from '@aws-sdk/client-s3';
    // 
    // const command = new HeadObjectCommand({
    //   Bucket: bucket,
    //   Key: key,
    // });
    // 
    // const result = await this.s3Client.send(command);
    // 
    // return {
    //   size: result.ContentLength,
    //   contentType: result.ContentType,
    //   lastModified: result.LastModified,
    //   etag: result.ETag,
    // };

    // Mock
    return {
      size: 1024,
      contentType: 'image/jpeg',
      lastModified: new Date(),
    };
  }

  async copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<boolean> {
    // Real implementation:
    // import { CopyObjectCommand } from '@aws-sdk/client-s3';
    // 
    // const command = new CopyObjectCommand({
    //   CopySource: `${sourceBucket}/${sourceKey}`,
    //   Bucket: destBucket,
    //   Key: destKey,
    // });
    // 
    // await this.s3Client.send(command);
    
    this.logger.log(`[S3] Copied: ${sourceBucket}/${sourceKey} → ${destBucket}/${destKey}`);
    return true;
  }

  async list(bucket: string, prefix?: string): Promise<Array<{
    key: string;
    size: number;
    lastModified: Date;
  }>> {
    // Real implementation:
    // import { ListObjectsV2Command } from '@aws-sdk/client-s3';
    // 
    // const command = new ListObjectsV2Command({
    //   Bucket: bucket,
    //   Prefix: prefix,
    // });
    // 
    // const result = await this.s3Client.send(command);
    // 
    // return (result.Contents || []).map(item => ({
    //   key: item.Key,
    //   size: item.Size,
    //   lastModified: item.LastModified,
    // }));

    // Mock
    return [];
  }
}

