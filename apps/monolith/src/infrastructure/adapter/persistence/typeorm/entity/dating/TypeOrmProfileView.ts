import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('profile_views')
@Index(['profileId', 'viewedAt'])
@Index(['viewerId'])
export class TypeOrmProfileView {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36, name: 'profile_id' })
  profileId: string;

  @Column('varchar', { length: 36, name: 'viewer_id' })
  viewerId: string;

  @Column('timestamp', { name: 'viewed_at' })
  viewedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}

