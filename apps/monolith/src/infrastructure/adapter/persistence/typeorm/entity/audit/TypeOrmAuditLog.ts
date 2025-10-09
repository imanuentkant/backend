import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('audit_log')
export class TypeOrmAuditLog {
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v1mc()' })
  id!: string;

  @Column('varchar', { name: 'actor_id', nullable: true })
  actorId?: string | null;

  @Column('varchar', { name: 'method' })
  method!: string;

  @Column('varchar', { name: 'path' })
  path!: string;

  @Column('int', { name: 'status_code' })
  statusCode!: number;

  @Column('varchar', { name: 'ip', nullable: true })
  ip?: string | null;

  @Column('varchar', { name: 'user_agent', nullable: true })
  userAgent?: string | null;

  @Column('jsonb', { name: 'body', nullable: true })
  body?: object | null;

  @Column('jsonb', { name: 'params', nullable: true })
  params?: object | null;

  @Column('jsonb', { name: 'query', nullable: true })
  query?: object | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
