import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../entities/user.entity';
import { Repository } from 'typeorm';

export class TestUtils {
  public static INIT_MODULES = [];

  public static INIT_PROVIDERS = [];

  public static getServices(module: TestingModule) {}

  public static getModels(module: TestingModule) {
    const userModel = module.get(
      getRepositoryToken(UserEntity),
    ) as Repository<any>;

    return { userModel };
  }

  public static async clearDB(module: TestingModule) {
    const models = this.getModels(module);
    const promises = [];
    for (const [key, model] of Object.entries(models)) {
      promises.push(model.createQueryBuilder().delete().execute());
    }
    await Promise.all(promises);
  }
}
