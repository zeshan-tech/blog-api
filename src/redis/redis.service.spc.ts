import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';

describe('RedisService', () => {
  let service: RedisService;
  let mockRedisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: Redis,
          useValue: {
            set: jest.fn(),
            setex: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    mockRedisClient = module.get<Redis>(Redis);
    service['redisClient'] = mockRedisClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store value in temp store with default TTL and return ID', async () => {
    const mockValue = { name: 'John' };
    const mockId = '123';

    jest.spyOn(mockRedisClient, 'setex').mockRejectedValueOnce('OK');

    const result = await service.storeValueInTempStore(mockValue, mockId);

    expect(result).toEqual(mockId);
    expect(mockRedisClient.setex).toHaveBeenCalled();
  });

  it('should store value in temp store with custom TTL and return ID', async () => {
    const mockValue = { name: 'John' };
    const mockId = '123';

    jest.spyOn(mockRedisClient, 'setex').mockResolvedValueOnce('OK');

    const result = await service.storeValueInTempStore(mockValue, mockId, 20000);

    expect(result).toEqual(mockId);
    expect(mockRedisClient.setex).toHaveBeenCalledWith('tempStore:123', 20000, JSON.stringify(mockValue));
  });

  it('should store value in temp store with override option', async () => {
    const mockValue = { name: 'John' };
    const mockId = '123';

    jest.spyOn(mockRedisClient, 'set').mockResolvedValueOnce('OK');

    const result = await service.storeValueInTempStore(mockValue, mockId, undefined, true);

    expect(result).toEqual(mockId);
    expect(mockRedisClient.set).toHaveBeenCalledWith('tempStore:123', JSON.stringify(mockValue));
  });

  it('should get value from temp store', async () => {
    const mockValue = { name: 'John' };
    const mockId = '123';

    jest.spyOn(mockRedisClient, 'get').mockResolvedValueOnce(JSON.stringify(mockValue));

    const result = await service.getValueFromTempStore(mockId);

    expect(result).toEqual(mockValue);
    expect(mockRedisClient.get).toHaveBeenCalledWith('tempStore:123');
  });

  it('should remove value from temp store', async () => {
    const mockId = '123';

    jest.spyOn(mockRedisClient, 'del').mockResolvedValueOnce(0);

    await service.removeValueFromTempStore(mockId);

    expect(mockRedisClient.del).toHaveBeenCalledWith('tempStore:123');
  });
});
