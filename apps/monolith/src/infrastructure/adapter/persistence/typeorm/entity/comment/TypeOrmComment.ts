import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('comment')
export class TypeOrmComment {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'post_id' })
  postId!: string;

  @Column('uuid', { name: 'author_id' })
  authorId!: string;

  @Column('text', { name: 'content' })
  content!: string;

  @Column('int', { name: 'rating', nullable: true })
  rating?: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}


