import { Generated, PrimaryGeneratedColumn } from 'typeorm';

export default class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  readonly id: string;
}
