import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import BaseEntity from './base-entity.entity';

export default class TimestampEntity extends BaseEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    precision: 3,
  })
  readonly createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    precision: 3,
  })
  readonly updatedAt: Date;
}
