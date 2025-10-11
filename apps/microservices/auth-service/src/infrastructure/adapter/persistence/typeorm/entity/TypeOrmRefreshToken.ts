import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('refresh_token')
export class TypeOrmRefreshToken {
  @PrimaryColumn()
  public id: string;

  @Column()
  public userId: string;

  @Column({ unique: true })
  public token: string;

  @Column()
  public expiresAt: Date;

  @Column()
  public createdAt: Date;
}

