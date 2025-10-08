# 📦 HƯỚNG DẪN CHUYỂN ĐỔI STORAGE PROVIDER

## 🎯 TỔNG QUAN

Hệ thống sử dụng **abstraction pattern** để dễ dàng chuyển đổi giữa các storage providers:
- ✅ **Hiện tại**: MinIO (local development)
- ✅ **Tương lai**: AWS S3, Google Cloud Storage, Azure Blob (chỉ cần đổi config!)

**Không cần thay đổi code business logic!** 🎉

---

## 🏗️ KIẾN TRÚC

```
┌─────────────────────────────────────┐
│  PropertyPhotoController            │
│  (Business Logic - KHÔNG ĐỔI)      │
└────────────┬────────────────────────┘
             │ uses
             ▼
┌─────────────────────────────────────┐
│  FileStoragePort (Interface)        │
│  - upload()                          │
│  - delete()                          │
│  - getUrl()                          │
└────────────┬────────────────────────┘
             │ implements
       ┌─────┴─────┬─────────┬────────┐
       │           │         │        │
┌──────▼──┐  ┌────▼───┐  ┌──▼───┐  ┌─▼────┐
│ MinIO   │  │  S3    │  │ GCS  │  │Azure │
│Adapter  │  │Adapter │  │Adapter  │Adapter│
└─────────┘  └────────┘  └──────┘  └──────┘
```

**Factory Pattern**: Tự động chọn adapter dựa trên env variable

---

## ✅ HIỆN TẠI: MinIO

### Configuration
```bash
# env/local.env
FILE_STORAGE_PROVIDER=minio          # Default
FILE_STORAGE_ENDPOINT=localhost
FILE_STORAGE_PORT=9000
FILE_STORAGE_ACCESS_KEY=aid6jaeng6IeWahv6hae
FILE_STORAGE_SECRET_KEY=ri5aX5Meishi9haihooB
FILE_STORAGE_USE_SSL=false
FILE_STORAGE_BASE_PATH=http://localhost:9000
```

### Start MinIO
```bash
docker-compose up -d minio_local
```

### Test Upload
```bash
# Upload via API
POST /api/properties/123/photos
file: [image.jpg]

# File sẽ được lưu tại:
# MinIO: http://localhost:9000/property-photos/properties/123/uuid-image.jpg
```

---

## 🔄 CHUYỂN SANG AWS S3

### Bước 1: Install Dependencies
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Bước 2: Update Environment
```bash
# env/production.env
FILE_STORAGE_PROVIDER=s3             # Đổi từ minio → s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
FILE_STORAGE_BASE_PATH=https://d123abc.cloudfront.net  # CloudFront CDN
```

### Bước 3: Uncomment S3 Code
```typescript
// src/infrastructure/adapter/storage/S3FileStorageAdapter.ts
// Uncomment các dòng:
import { S3Client } from '@aws-sdk/client-s3';
// ... và tất cả real implementation code
```

### Bước 4: Create S3 Bucket
```bash
# Via AWS CLI
aws s3 mb s3://yourapp-property-photos --region us-east-1

# Set public read policy (nếu cần)
aws s3api put-bucket-policy --bucket yourapp-property-photos --policy file://bucket-policy.json
```

### Bước 5: Restart Application
```bash
npm run build
pm2 restart all

# Hoặc
npm run dev
```

**DONE! Giờ dùng S3!** ✅

---

## 🔄 CHUYỂN SANG GOOGLE CLOUD STORAGE

### Bước 1: Install Dependencies
```bash
npm install @google-cloud/storage
```

### Bước 2: Update Environment
```bash
# env/production.env
FILE_STORAGE_PROVIDER=gcs            # Google Cloud Storage
GCP_PROJECT_ID=your-project-id
GCP_KEY_FILE=./service-account-key.json
FILE_STORAGE_BASE_PATH=https://storage.googleapis.com
```

### Bước 3: Uncomment GCS Code
```typescript
// src/infrastructure/adapter/storage/GoogleCloudStorageAdapter.ts
// Uncomment implementation code
```

### Bước 4: Create GCS Bucket
```bash
# Via gcloud CLI
gsutil mb gs://yourapp-property-photos

# Set public access
gsutil iam ch allUsers:objectViewer gs://yourapp-property-photos
```

### Bước 5: Restart
```bash
npm run build
pm2 restart all
```

**DONE! Giờ dùng GCS!** ✅

---

## 🔄 CHUYỂN SANG AZURE BLOB STORAGE

### Future Implementation

```bash
# env/production.env
FILE_STORAGE_PROVIDER=azure
AZURE_STORAGE_ACCOUNT=youraccount
AZURE_STORAGE_KEY=...
AZURE_STORAGE_CONNECTION_STRING=...
```

**Tạo AzureBlobStorageAdapter implements FileStoragePort**

---

## 🎯 SO SÁNH STORAGE PROVIDERS

| Feature | MinIO | AWS S3 | GCS | Azure |
|---------|-------|--------|-----|-------|
| **Cost** | Free | Pay per use | Pay per use | Pay per use |
| **Setup** | Easy | Medium | Medium | Medium |
| **Speed** | Fast (local) | Fast (global) | Fast | Fast |
| **CDN** | Manual | CloudFront | Cloud CDN | Azure CDN |
| **Scalability** | Medium | Unlimited | Unlimited | Unlimited |
| **Reliability** | 99.9% | 99.99% | 99.95% | 99.9% |

### Cost Comparison:

**MinIO** (Self-hosted):
- Storage: $0 (own server)
- Transfer: $0
- Requests: $0
- **Total**: $0/month

**AWS S3**:
- Storage: $0.023/GB/month
- Transfer: $0.09/GB (out)
- Requests: $0.005/1000 PUT
- **Example**: 100GB, 100k uploads/month = ~$15/month

**Google Cloud Storage**:
- Storage: $0.020/GB/month
- Transfer: $0.12/GB
- Similar to S3

**Azure Blob**:
- Storage: $0.018/GB/month
- Transfer: $0.087/GB
- Slightly cheaper than S3

---

## 🔧 MIGRATION STRATEGY

### Development → Production Migration

#### Scenario 1: MinIO → S3 (Recommended)

```bash
# 1. Setup S3 bucket
aws s3 mb s3://yourapp-photos

# 2. Copy existing files từ MinIO sang S3
aws s3 sync \
  http://localhost:9000/property-photos \
  s3://yourapp-photos \
  --acl public-read

# 3. Update env
FILE_STORAGE_PROVIDER=s3
FILE_STORAGE_BASE_PATH=https://d123.cloudfront.net

# 4. Update database URLs (if stored)
UPDATE property_photos 
SET url = REPLACE(url, 'http://localhost:9000', 'https://d123.cloudfront.net');

# 5. Restart app
pm2 restart all
```

#### Scenario 2: Dual Storage (Transition Period)

```typescript
// Upload to both MinIO và S3 during migration
const uploadPromises = [
  minioAdapter.upload(options),
  s3Adapter.upload(options),
];

await Promise.all(uploadPromises);
```

#### Scenario 3: MinIO → S3 with CDN

```bash
# 1. Setup CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name yourapp-photos.s3.amazonaws.com

# 2. Get CloudFront URL: d123abc.cloudfront.net

# 3. Update env
FILE_STORAGE_BASE_PATH=https://d123abc.cloudfront.net

# Benefits:
# - Global CDN
# - Faster image loading
# - Automatic caching
# - SSL included
```

---

## ⚡ SWITCHING STORAGE - STEP BY STEP

### Current: MinIO (Development)

```bash
# .env
FILE_STORAGE_PROVIDER=minio
FILE_STORAGE_ENDPOINT=localhost
FILE_STORAGE_PORT=9000
FILE_STORAGE_ACCESS_KEY=...
FILE_STORAGE_SECRET_KEY=...
```

**Code không cần thay đổi!**

### Switch to: AWS S3 (Production)

#### Step 1: Install SDK
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### Step 2: Update .env
```bash
# .env hoặc env/production.env
FILE_STORAGE_PROVIDER=s3             # Chỉ cần đổi dòng này!

# AWS credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# Optional: CloudFront CDN
FILE_STORAGE_BASE_PATH=https://d123abc.cloudfront.net
```

#### Step 3: Uncomment S3 Code
```typescript
// src/infrastructure/adapter/storage/S3FileStorageAdapter.ts
// Uncomment tất cả real implementation code
// Remove mock code
```

#### Step 4: Restart
```bash
npm run build
pm2 restart all
```

**DONE! Tất cả uploads giờ vào S3!** ✅

**Code business logic không đổi 1 dòng nào!** 🎊

---

## 📝 ENVIRONMENT VARIABLES

### For MinIO:
```bash
FILE_STORAGE_PROVIDER=minio
FILE_STORAGE_ENDPOINT=localhost
FILE_STORAGE_PORT=9000
FILE_STORAGE_ACCESS_KEY=your_key
FILE_STORAGE_SECRET_KEY=your_secret
FILE_STORAGE_USE_SSL=false
FILE_STORAGE_BASE_PATH=http://localhost:9000
```

### For AWS S3:
```bash
FILE_STORAGE_PROVIDER=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
FILE_STORAGE_BASE_PATH=https://d123.cloudfront.net  # CDN optional
```

### For Google Cloud Storage:
```bash
FILE_STORAGE_PROVIDER=gcs
GCP_PROJECT_ID=your-project
GCP_KEY_FILE=./service-account.json
FILE_STORAGE_BASE_PATH=https://storage.googleapis.com
```

### For Azure Blob:
```bash
FILE_STORAGE_PROVIDER=azure
AZURE_STORAGE_ACCOUNT=youraccount
AZURE_STORAGE_KEY=...
AZURE_STORAGE_CONNECTION_STRING=...
```

---

## 🎨 USAGE EXAMPLES

### Upload Photo (Trong Controller)

```typescript
// Code giống nhau cho TẤT CẢ storage providers!

// Inject FileStoragePort
constructor(
  @Inject(CoreDITokens.FileStorage) 
  private readonly fileStorage: FileStoragePort,
) {}

// Upload
const result = await this.fileStorage.upload({
  bucket: 'property-photos',
  filename: `properties/${propertyId}/${uuid()}.jpg`,
  buffer: file.buffer,
  contentType: file.mimetype,
  metadata: { propertyId },
});

// Result:
// {
//   url: "https://...",  // MinIO, S3, GCS tùy config
//   key: "properties/123/uuid.jpg",
//   bucket: "property-photos",
//   size: 12345
// }
```

### Delete Photo

```typescript
// Xóa - code giống nhau!
await this.fileStorage.delete('property-photos', 'properties/123/photo.jpg');

// Works với MinIO, S3, GCS, Azure
```

### Get Signed URL (Private Files)

```typescript
// Tạo signed URL cho private files
const signedUrl = await this.fileStorage.getSignedUrl(
  'property-photos',
  'properties/123/photo.jpg',
  3600  // 1 hour
);

// MinIO: http://localhost:9000/...?signature=...
// S3: https://s3.amazonaws.com/...?X-Amz-Signature=...
// GCS: https://storage.googleapis.com/...?Expires=...
```

---

## 💡 BEST PRACTICES

### 1. Use Environment Variables
```bash
# ĐỔI CHỈ MỘT DÒNG!
FILE_STORAGE_PROVIDER=minio  # Development
FILE_STORAGE_PROVIDER=s3     # Production
FILE_STORAGE_PROVIDER=gcs    # Alternative
```

### 2. CDN Integration
```bash
# MinIO → CloudFront
FILE_STORAGE_BASE_PATH=https://d123.cloudfront.net

# S3 → CloudFront  
FILE_STORAGE_BASE_PATH=https://d456.cloudfront.net

# GCS → Cloud CDN
FILE_STORAGE_BASE_PATH=https://cdn.yourdomain.com
```

### 3. Bucket Naming
```bash
# Development
property-photos
user-avatars
documents

# Production (với environment prefix)
prod-property-photos
prod-user-avatars
staging-property-photos
```

### 4. File Organization
```bash
# Good structure:
properties/
  ├── {propertyId}/
  │   ├── {uuid}-photo1.jpg
  │   ├── {uuid}-photo2.jpg
  │   └── {uuid}-photo3.jpg
  
users/
  ├── {userId}/
  │   └── avatar.jpg

# Benefits:
- Easy to find files
- Easy to delete all property photos
- Easy to migrate
```

---

## 🔄 MIGRATION SCENARIOS

### Scenario 1: MinIO → S3 (Zero Downtime)

#### Phase 1: Dual Write
```typescript
// Tạm thời upload vào cả 2
const [minioResult, s3Result] = await Promise.all([
  minioAdapter.upload(options),
  s3Adapter.upload(options),
]);

// Save s3Result.url to database
```

#### Phase 2: Switch Reads
```bash
# Update all database URLs
UPDATE property_photos 
SET url = REPLACE(url, 'minio-domain', 's3-domain');

# Set FILE_STORAGE_PROVIDER=s3
# Restart app
```

#### Phase 3: Stop MinIO Writes
```bash
# Remove dual write code
# Chỉ upload vào S3
```

#### Phase 4: Migrate Old Files
```bash
# Copy MinIO files sang S3
mc mirror minio/property-photos s3/yourapp-photos
```

#### Phase 5: Decommission MinIO
```bash
# Stop MinIO sau khi verify tất cả files đã ở S3
docker-compose stop minio_local
```

---

### Scenario 2: S3 → GCS (Cross-Cloud Migration)

```bash
# 1. Install gsutil
# 2. Configure credentials
gcloud auth login

# 3. Copy S3 → GCS
gsutil -m rsync -r s3://yourapp-photos gs://yourapp-photos

# 4. Update env
FILE_STORAGE_PROVIDER=gcs

# 5. Restart app
```

---

## 🎯 QUICK SWITCH GUIDE

### Development (MinIO):
```bash
# .env
FILE_STORAGE_PROVIDER=minio

# Start
docker-compose up -d minio_local
npm run dev
```

### Staging (S3):
```bash
# .env.staging
FILE_STORAGE_PROVIDER=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Deploy
kubectl apply -f k8s/
```

### Production (S3 + CloudFront):
```bash
# .env.production
FILE_STORAGE_PROVIDER=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
FILE_STORAGE_BASE_PATH=https://cdn.yourdomain.com

# Deploy
kubectl apply -f k8s/ -n production
```

---

## 📊 WHEN TO USE WHAT

### MinIO:
✅ **Use When**:
- Local development
- Self-hosted preference
- Cost optimization
- Full control needed
- Private cloud

❌ **Don't Use When**:
- Need global CDN
- Multi-region deployment
- Want managed service
- Need 99.99% SLA

### AWS S3:
✅ **Use When**:
- Production deployment
- Need CDN (CloudFront)
- Multi-region
- Want managed service
- Already on AWS

💰 **Cost**: ~$15-50/month (medium usage)

### Google Cloud Storage:
✅ **Use When**:
- Production deployment
- Already on GCP
- Need global CDN
- Want managed service

💰 **Cost**: Similar to S3

### Azure Blob:
✅ **Use When**:
- Already on Azure
- Enterprise deployment
- Microsoft ecosystem

---

## 🔐 SECURITY

### MinIO:
```bash
# Access control via policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::property-photos/*"
    }
  ]
}
```

### S3:
```bash
# Bucket policy
# IAM roles
# Signed URLs for private files

# Encryption at rest
aws s3api put-bucket-encryption \
  --bucket yourapp-photos \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

---

## 💡 PRO TIPS

### 1. Use CDN Always
```bash
# MinIO + nginx caching
# S3 + CloudFront
# GCS + Cloud CDN

# Benefits:
- Faster load times
- Lower bandwidth costs
- Global distribution
- SSL included
```

### 2. Image Optimization
```bash
# Before upload:
- Resize to max 2048px
- Compress (80% quality)
- Convert to WebP
- Generate thumbnails

# Can implement in FileStorageAdapter
```

### 3. Backup Strategy
```bash
# MinIO: Regular backups
mc mirror minio/property-photos backup-location/

# S3: Versioning enabled
aws s3api put-bucket-versioning \
  --bucket yourapp-photos \
  --versioning-configuration Status=Enabled

# S3: Cross-region replication
aws s3api put-bucket-replication --bucket source --replication-configuration file://replication.json
```

### 4. Cost Optimization
```bash
# S3 Lifecycle policies
# Move old files to Glacier after 90 days
{
  "Rules": [{
    "Id": "Archive old photos",
    "Status": "Enabled",
    "Transitions": [{
      "Days": 90,
      "StorageClass": "GLACIER"
    }]
  }]
}
```

---

## 🧪 TESTING

### Test Storage Switch

```bash
# 1. Upload with MinIO
FILE_STORAGE_PROVIDER=minio npm run dev
# Upload photo → check MinIO

# 2. Switch to S3 (mock)
FILE_STORAGE_PROVIDER=s3 npm run dev
# Upload photo → check S3 (mock response)

# 3. Verify abstraction works
# Code không thay đổi!
# Upload endpoint vẫn giống nhau
# Chỉ storage backend khác
```

---

## 📋 CHECKLIST ĐỔI STORAGE

### Pre-Migration:
- [ ] Backup all current files
- [ ] Test new storage provider
- [ ] Update environment variables
- [ ] Verify credentials work
- [ ] Test upload/download/delete
- [ ] Check costs

### Migration:
- [ ] Install new SDK
- [ ] Uncomment adapter code
- [ ] Create buckets/containers
- [ ] Copy existing files
- [ ] Update database URLs
- [ ] Update FILE_STORAGE_PROVIDER
- [ ] Restart application
- [ ] Verify all uploads work

### Post-Migration:
- [ ] Monitor for errors
- [ ] Check costs
- [ ] Verify CDN working
- [ ] Test all photo operations
- [ ] Remove old storage (if safe)

---

## 🎊 SUMMARY

### Abstraction Benefits:
- ✅ **Easy switching** - Chỉ cần đổi env variable
- ✅ **No code changes** - Business logic không đổi
- ✅ **Future-proof** - Dễ add storage mới
- ✅ **Testable** - Mock storage trong tests
- ✅ **Clean Architecture** - Separation of concerns

### Current Setup:
- ✅ **MinIO** working now
- ✅ **S3** ready (code có sẵn)
- ✅ **GCS** ready (code có sẵn)
- ✅ **Azure** structure ready

### To Switch:
```bash
# 1 dòng env variable!
FILE_STORAGE_PROVIDER=s3
```

**Perfect abstraction!** 🎉

---

## 🚀 RECOMMENDED PATH

### Development:
```
MinIO (local, free)
```

### Staging:
```
S3 (test production setup)
```

### Production:
```
S3 + CloudFront CDN
(global, fast, reliable)
```

### Enterprise:
```
Multi-region S3 + CloudFront
+ Image optimization
+ Backup to Glacier
```

---

**Hệ thống giờ flexible và future-proof!** 🎉

**Switch storage provider chỉ với 1 env variable!** 🚀

