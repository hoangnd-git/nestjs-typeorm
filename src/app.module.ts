import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import V1Module from './modules/v1/v1.module';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from './providers/socket/socket.module';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SocketModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: (): CacheModuleOptions => {
        const options: any = {
          store: redisStore,
          ttl: Number(process.env.REDIS_TTL),
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT || 6379),
          password: process.env.REDIS_PASSWORD,
        };
        return options;
      },
      isGlobal: true,
    }),
    V1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
