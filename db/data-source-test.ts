import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import UserEntity from '../src/entities/user.entity';

export const dataSourceTestOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST_TEST || 'postgres',
  port: process.env.POSTGRESQL_PORT_TEST as unknown as number,
  database: process.env.POSTGRESQL_DB_TEST,
  username: process.env.POSTGRESQL_ROOT_USER_TEST,
  password: process.env.POSTGRESQL_PASSWORD_TEST,
  entities: [UserEntity],
};

const dataSourceTest = new DataSource(dataSourceTestOptions);

export default dataSourceTest;
