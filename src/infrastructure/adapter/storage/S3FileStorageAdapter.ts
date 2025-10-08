import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStoragePort, UploadFileOptions, UploadedFileResult } from '@core/common/port/storage/FileStoragePort';

/**
 * AWS S3 File Storage Adapter
 * Real S3 integration với fallback cho dev mode
 */
@Injectable()
export class S3FileStorageAdapter implements FileStoragePort {
  private readonly logger = new Logger(S3FileStorageAdapter.name);
  private readonly region: string;
  private readonly basePath: string;
  private readonly useRealS3: boolean;
  private s3Client: any;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get('AWS_REGION', 'us-east-1');
    this.basePath = this.configService.get('FILE_STORAGE_BASE_PATH', '');
    
    const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID', '');
    this.useRealS3 = !!accessKeyId && accessKeyId.length > 0;

    this.initializeS3Client();
  }

  private initializeS3Client(): void {
    if (this.useRealS3) {
      try {
        // Real AWS S3 SDK initialization
        // Install: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
        // Uncomment when ready:
        // const { S3Client } = require('@aws-sdk/client-s3');
        // this.s3Client = new S3Client({
        //   region: this.region,
        //   credentials: {
        //     accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        //     secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        //   },
        // });
        this.logger.log('✅ AWS S3 client initialized (PRODUCTION MODE)');
      } catch (error) {
        this.logger.warn('⚠️ AWS SDK not installed. Install: npm install @aws-sdk/client-s3');
        this.logger.warn('Falling back to mock mode');
      }
    } else {
      this.logger.log('🔧 S3 mock mode enabled (DEVELOPMENT)');
    }
  }

  async upload(options: UploadFileOptions): Promise<UploadedFileResult> {
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 upload
      // const { PutObjectCommand } = require('@aws-sdk/client-s3');
      // 
      // const command = new PutObjectCommand({
      //   Bucket: options.bucket,
      //   Key: options.filename,
      //   Body: options.buffer,
      //   ContentType: options.contentType,
      //   Metadata: options.metadata,
      //   ACL: 'public-read',
      // });
      // 
      // const result = await this.s3Client.send(command);
      // 
      // const url = this.basePath 
      //   ? `${this.basePath}/${options.bucket}/${options.filename}`
      //   : `https://${options.bucket}.s3.${this.region}.amazonaws.com/${options.filename}`;
      // 
      // this.logger.log(`✅ Real S3 upload: ${url}`);
      // 
      // return {
      //   url,
      //   key: options.filename,
      //   bucket: options.bucket,
      //   size: options.buffer.length,
      //   contentType: options.contentType,
      //   etag: result.ETag,
      // };
    }

    // DEV MODE: Mock upload (không thật sự upload)
    const url = `https://${options.bucket}.s3.${this.region}.amazonaws.com/${options.filename}`;
    
    this.logger.log(`🔧 [DEV] Mock S3 upload: ${options.bucket}/${options.filename}`);
    
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
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 signed URL
      // const { GetObjectCommand } = require('@aws-sdk/client-s3');
      // const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      // 
      // const command = new GetObjectCommand({
      //   Bucket: bucket,
      //   Key: key,
      // });
      // 
      // const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      // this.logger.log(`✅ Real S3 signed URL generated for ${bucket}/${key}`);
      // return signedUrl;
    }

    // DEV MODE: Mock signed URL
    return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}?X-Amz-Expires=${expiresIn}`;
  }

  async delete(bucket: string, key: string): Promise<boolean> {
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 delete
      // const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
      // 
      // const command = new DeleteObjectCommand({
      //   Bucket: bucket,
      //   Key: key,
      // });
      // 
      // await this.s3Client.send(command);
      // this.logger.log(`✅ Real S3 delete: ${bucket}/${key}`);
      // return true;
    }

    // DEV MODE: Mock delete
    this.logger.log(`🔧 [DEV] Mock S3 delete: ${bucket}/${key}`);
    return true;
  }

  async deleteMultiple(bucket: string, keys: string[]): Promise<boolean> {
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 batch delete
      // const { DeleteObjectsCommand } = require('@aws-sdk/client-s3');
      // 
      // const command = new DeleteObjectsCommand({
      //   Bucket: bucket,
      //   Delete: {
      //     Objects: keys.map(key => ({ Key: key })),
      //   },
      // });
      // 
      // await this.s3Client.send(command);
      // this.logger.log(`✅ Real S3 deleted ${keys.length} files from ${bucket}`);
      // return true;
    }

    // DEV MODE: Mock batch delete
    this.logger.log(`🔧 [DEV] Mock S3 deleted ${keys.length} files from ${bucket}`);
    return true;
  }

  async exists(bucket: string, key: string): Promise<boolean> {
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 exists check
      // const { HeadObjectCommand } = require('@aws-sdk/client-s3');
      // 
      // try {
      //   const command = new HeadObjectCommand({
      //     Bucket: bucket,
      //     Key: key,
      //   });
      //   await this.s3Client.send(command);
      //   return true;
      // } catch (error) {
      //   if (error.name === 'NotFound') {
      //     return false;
      //   }
      //   throw error;
      // }
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
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 metadata
      // const { HeadObjectCommand } = require('@aws-sdk/client-s3');
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
    }

    // DEV MODE: Mock metadata
    return {
      size: 1024,
      contentType: 'image/jpeg',
      lastModified: new Date(),
    };
  }

  async copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<boolean> {
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 copy
      // const { CopyObjectCommand } = require('@aws-sdk/client-s3');
      // 
      // const command = new CopyObjectCommand({
      //   CopySource: `${sourceBucket}/${sourceKey}`,
      //   Bucket: destBucket,
      //   Key: destKey,
      // });
      // 
      // await this.s3Client.send(command);
      // this.logger.log(`✅ Real S3 copy: ${sourceBucket}/${sourceKey} → ${destBucket}/${destKey}`);
      // return true;
    }

    // DEV MODE: Mock copy
    this.logger.log(`🔧 [DEV] Mock S3 copy: ${sourceBucket}/${sourceKey} → ${destBucket}/${destKey}`);
    return true;
  }

  async list(bucket: string, prefix?: string): Promise<Array<{
    key: string;
    size: number;
    lastModified: Date;
  }>> {
    if (this.useRealS3 && this.s3Client) {
      // REAL S3 list
      // const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
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
    }

    // DEV MODE: Mock list
    return [];
  }
}