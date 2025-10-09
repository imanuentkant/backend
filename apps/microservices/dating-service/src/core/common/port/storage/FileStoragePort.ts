/**
 * File Storage Port - Interface cho storage services
 * Abstraction để dễ dàng switch giữa MinIO, S3, Google Cloud Storage, Azure Blob, etc.
 */

export interface UploadFileOptions {
  bucket: string;
  filename: string;
  buffer: Buffer;
  contentType: string;
  metadata?: Record<string, string>;
}

export interface UploadedFileResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
  contentType: string;
  etag?: string;
}

export interface FileStoragePort {
  
  /**
   * Upload file
   */
  upload(options: UploadFileOptions): Promise<UploadedFileResult>;
  
  /**
   * Upload nhiều files
   */
  uploadMultiple(files: UploadFileOptions[]): Promise<UploadedFileResult[]>;
  
  /**
   * Get file URL
   */
  getFileUrl(bucket: string, key: string): Promise<string>;
  
  /**
   * Get signed URL (for private files)
   */
  getSignedUrl(bucket: string, key: string, expiresIn?: number): Promise<string>;
  
  /**
   * Delete file
   */
  delete(bucket: string, key: string): Promise<boolean>;
  
  /**
   * Delete multiple files
   */
  deleteMultiple(bucket: string, keys: string[]): Promise<boolean>;
  
  /**
   * Check if file exists
   */
  exists(bucket: string, key: string): Promise<boolean>;
  
  /**
   * Get file metadata
   */
  getMetadata(bucket: string, key: string): Promise<{
    size: number;
    contentType: string;
    lastModified: Date;
    etag?: string;
  }>;
  
  /**
   * Copy file
   */
  copy(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<boolean>;
  
  /**
   * List files in bucket
   */
  list(bucket: string, prefix?: string): Promise<Array<{
    key: string;
    size: number;
    lastModified: Date;
  }>>;
}

