import { AuthModule } from '@application/di/AuthModule';
import { InfrastructureModule } from '@application/di/InfrastructureModule';
import { MediaModule } from '@application/di/MediaModule';
import { PostModule } from '@application/di/PostModule';
import { UserModule } from '@application/di/UserModule';
import { Module } from '@nestjs/common';
import { CommentModule } from '@application/di/CommentModule';
import { AlbumModule } from '@application/di/AlbumModule';
import { ConfigModule } from '@nestjs/config';
import { SecurityModule } from '@application/di/SecurityModule';
import { StorageModule } from '@application/di/StorageModule';
import { AirbnbModule } from '@application/di/AirbnbModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SecurityModule,
    StorageModule,        // 📦 File Storage (MinIO → S3/GCS easy switch)
    InfrastructureModule,
    AuthModule,
    UserModule,
    MediaModule,
    PostModule,
    CommentModule,
    AlbumModule,
    AirbnbModule,        // 🏠 Airbnb Features
  ]
})
export class RootModule {}
