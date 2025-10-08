import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmDirectory } from '@infrastructure/adapter/persistence/typeorm/TypeOrmDirectory';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/TypeOrmUser';
import { TypeOrmPost } from '@infrastructure/adapter/persistence/typeorm/entity/post/TypeOrmPost';
import { PostStatus } from '@core/common/enums/PostEnums';
import { TypeOrmMedia } from '@infrastructure/adapter/persistence/typeorm/entity/media/TypeOrmMedia';
import { UserRole } from '@core/common/enums/UserEnums';
import { MediaType } from '@core/common/enums/MediaEnums';
import { v7 as uuid } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config({ path: './env/local.env' });

async function createDataSource(): Promise<DataSource> {
  const cfg = new ConfigService(process.env);
  const ds = new DataSource({
    type: 'postgres',
    host: cfg.get('DB_HOST') || 'localhost',
    port: Number(cfg.get('DB_PORT') || 5432),
    username: cfg.get('DB_USERNAME') || 'postgres',
    password: cfg.get('DB_PASSWORD') || 'postgres',
    database: cfg.get('DB_NAME') || 'postgres',
    logging: false,
    entities: [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
  });
  return ds.initialize();
}

async function seed(): Promise<void> {
  const ds = await createDataSource();
  try {
    const userRepo = ds.getRepository(TypeOrmUser);
    const postRepo = ds.getRepository(TypeOrmPost);
    const mediaRepo = ds.getRepository(TypeOrmMedia);

    const partnerId = uuid();
    await userRepo.insert({
      id: partnerId,
      firstName: 'Demo',
      lastName: 'Partner',
      email: 'partner@example.com',
      role: UserRole.PARTNER,
      password: 'hashed-password',
      createdAt: new Date(),
      editedAt: null as any,
      removedAt: null as any,
    });

    const mediaId = uuid();
    await mediaRepo.insert({
      id: mediaId,
      ownerId: partnerId,
      name: 'cat.png',
      type: MediaType.IMAGE,
      relativePath: '/images/cat.png',
      size: 12345,
      ext: 'png',
      mimetype: 'image/png',
      createdAt: new Date(),
      editedAt: null as any,
      removedAt: null as any,
    });

    const postId = uuid();
    await postRepo.insert({
      id: postId,
      ownerId: partnerId,
      title: 'Hello World',
      imageId: mediaId,
      content: 'This is a demo post',
      status: PostStatus.DRAFT as any,
      createdAt: new Date(),
      editedAt: null as any,
      publishedAt: null as any,
      removedAt: null as any,
    });
  } finally {
    await ds.destroy();
  }
}

seed().then(() => {
  // eslint-disable-next-line no-console
  console.log('Seed completed');
  process.exit(0);
}).catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
