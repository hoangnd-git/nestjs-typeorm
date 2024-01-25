import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST || 'postgres',
  port: process.env.POSTGRESQL_PORT as unknown as number,
  database: process.env.POSTGRESQL_DB,
  username: process.env.POSTGRESQL_ROOT_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
