import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private redisClient: Redis) {}

  async storeValueInTempStore(value: any, key: string, ttl = 10000, override = false): Promise<string> {
    try {
      const _id = key ?? uuid();
      const keyPrefix = 'tempStore:';
      const storedKey = `${keyPrefix}${_id}`;

      if (override) {
        await this.redisClient.set(storedKey, JSON.stringify(value));
      } else {
        const expiration = ttl ?? 10000;
        await this.redisClient.setex(storedKey, expiration, JSON.stringify(value));
      }

      return _id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getValueFromTempStore<T>(key: string): Promise<T> {
    const result = await this.redisClient.get(`tempStore:${key}`);
    return JSON.parse(result) as T;
  }

  async removeValueFromTempStore(key: string): Promise<void> {
    try {
      await this.redisClient.del(`tempStore:${key}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
