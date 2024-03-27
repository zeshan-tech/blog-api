import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';

// Mocking dependencies
const userModelMock = {
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};
const redisServiceMock = {
  storeValueInTempStore: jest.fn(),
  getValueFromTempStore: jest.fn(),
};
const mailerServiceMock = {
  sendOTP: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let userMock: Partial<User>;

  beforeEach(async () => {
    userMock = {
      _id: new Types.ObjectId(),
      email: 'test@example.com',
      password: 'password',
      fullname: 'test name',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModelMock },
        { provide: RedisService, useValue: redisServiceMock },
        { provide: MailerService, useValue: mailerServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and send OTP', async () => {
      const input = {
        Email: 'test@example.com',
        Fullname: 'Test User',
        Password: 'password',
      };

      jest.spyOn(userModel, 'create').mockImplementationOnce(() => Promise.resolve(userMock as any));

      const result = await service.register(input);

      redisServiceMock.storeValueInTempStore.mockResolvedValueOnce(undefined);
      mailerServiceMock.sendOTP.mockResolvedValueOnce(undefined);

      // Assertion
      expect(result).toEqual({ message: 'Check your email' });
      expect(redisServiceMock.storeValueInTempStore).toHaveBeenCalled();
      expect(mailerServiceMock.sendOTP).toHaveBeenCalled();
    });
  });
});
