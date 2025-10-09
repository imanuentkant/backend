import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('album')
export class TypeOrmAlbum {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'post_id' })
  postId!: string;

  @Column('uuid', { name: 'owner_id' })
  ownerId!: string;

  @Column('varchar', { name: 'title' })
  title!: string;

  @Column('text', { name: 'description', nullable: true })
  description?: string | null;

  @Column('simple-array', { name: 'media_ids', default: '' })
  mediaIds!: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('timestamptz', { name: 'edited_at', nullable: true })
  editedAt?: Date | null;

  @Column('timestamptz', { name: 'removed_at', nullable: true })
  removedAt?: Date | null;
}

