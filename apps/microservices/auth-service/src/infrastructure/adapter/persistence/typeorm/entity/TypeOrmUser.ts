import { UserRole } from '@core/common/enums/UserEnums';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class TypeOrmUser {
  @PrimaryColumn()
  public id: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ unique: true })
  public email: string;

  @Column({ type: 'varchar' })
  public role: UserRole;

  @Column()
  public password: string;

  @Column()
  public createdAt: Date;

  @Column({ nullable: true })
  public editedAt: Date;

  @Column({ nullable: true })
  public removedAt: Date;
}

