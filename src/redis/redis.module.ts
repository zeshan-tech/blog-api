import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisModule as NRedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    NRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (): Promise<RedisModuleOptions> => {
        return {
          config: {
            // host: configService.get<string>('REDIS_HOST'),
            // port: configService.get<number>('REDIS_PORT'),
            // password: configService.get<string>('REDIS_PASSWORD'),
            // username: configService.get<string>('REDIS_USERNAME'),
            url: 'redis://127.0.0.1:6379',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
