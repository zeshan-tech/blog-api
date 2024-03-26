import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async storeValueInTempStore(value: any, key: string, ttl = 10000): Promise<string> {
    try {
      const ID = key ?? uuid();
      await this.redisClient.setex(`tempStore:${ID}`, ttl, JSON.stringify(value));
      return ID;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getValueFromTempStore<T>(key: string): Promise<T> {
    return this.redisClient.get(`tempStore:${key}`) as T;
  }

  async removeValueFromTempStore(key: string): Promise<void> {
    try {
      await this.redisClient.del(`tempStore:${key}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
