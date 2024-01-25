import { Column, Entity } from 'typeorm';
import TimestampEntity from './timestamp-entity.entity';

@Entity('user')
export default class UserEntity extends TimestampEntity {
  @Column({ length: 256, type: 'varchar', name: 'email', unique: true })
  readonly email: string;

  @Column({ length: 256, type: 'varchar', name: 'password' })
  readonly password: string;

  @Column({ length: 6, type: 'varchar', name: 'otp' })
  readonly otp: string;

  @Column({ type: 'boolean', default: false })
  readonly verified: boolean;
}
