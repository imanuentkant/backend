import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ReportReason, ReportStatus } from '@core/domain/dating/entity/UserReport';

@Entity('user_reports')
export class TypeOrmUserReport {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  reporter_id: string;

  @Column('varchar', { length: 36 })
  @Index()
  reported_id: string;

  @Column({
    type: 'enum',
    enum: ReportReason,
  })
  reason: ReportReason;

  @Column('text', { nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  @Index()
  status: ReportStatus;

  @Column('varchar', { length: 36, nullable: true })
  reviewed_by: string | null;

  @Column('timestamp', { nullable: true })
  reviewed_at: Date | null;

  @Column('text', { nullable: true })
  action_taken: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

