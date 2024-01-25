import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '../../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userModel: Repository<UserEntity>,
  ) {}

  async createNewUser(user: IUser): Promise<string> {
    const r = await this.userModel.insert(user);
    return r.identifiers[0].id;
  }

  async selectOne(
    querySQL: string,
    condition: Record<string, any>,
    selectFields: Array<string> = [],
  ): Promise<UserEntity> {
    const queryDb = this.userModel.createQueryBuilder('u');
    if (selectFields.length > 0) {
      queryDb.select(selectFields);
    }
    return await queryDb.where(querySQL, condition).getOne();
  }

  async update(
    filter: string,
    filterData: Record<string, any>,
    updateData: Record<string, any>,
  ): Promise<UpdateResult> {
    return await this.userModel
      .createQueryBuilder()
      .update()
      .set(updateData)
      .where(filter, filterData)
      .execute();
  }
}
