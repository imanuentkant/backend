import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { DateProposalStatus } from '@core/domain/dating/entity/DateProposal';

@Entity('date_proposals')
export class TypeOrmDateProposal {
  @PrimaryColumn('varchar', { length: 36 })
  id: string;

  @Column('varchar', { length: 36 })
  @Index()
  match_id: string;

  @Column('varchar', { length: 36 })
  @Index()
  proposed_by: string;

  @Column('varchar', { length: 36 })
  @Index()
  proposed_to: string;

  @Column('timestamp')
  proposed_date: Date;

  @Column('json')
  location: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };

  @Column('varchar', { length: 100 })
  activity: string;

  @Column('text', { nullable: true })
  notes: string | null;

  @Column({
    type: 'enum',
    enum: DateProposalStatus,
    default: DateProposalStatus.PENDING,
  })
  @Index()
  status: DateProposalStatus;

  @Column('timestamp', { nullable: true })
  responded_at: Date | null;

  @Column('text', { nullable: true })
  response_message: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
