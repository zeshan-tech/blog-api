import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MailerService } from '../mailer/mailer.service';
import { RedisService } from '../redis/redis.service';

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

      redisServiceMock.storeValueInTempStore.mockResolvedValueOnce(undefined);
      mailerServiceMock.sendOTP.mockResolvedValueOnce(undefined);

      const result = await service.register(input);

      expect(result).toEqual({ message: 'Check your email' });
      expect(redisServiceMock.storeValueInTempStore).toHaveBeenCalled();
      expect(mailerServiceMock.sendOTP).toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should verify email and update status', async () => {
      const input = {
        Email: 'test@example.com',
        OTP: '123456',
      };

      redisServiceMock.getValueFromTempStore.mockResolvedValueOnce('test@example.com');
      jest.spyOn(userModel, 'findOneAndUpdate').mockImplementationOnce(userMock as any);

      const result = await service.verifyEmail(input);

      expect(result).toEqual({ isSuccess: true });
      expect(redisServiceMock.getValueFromTempStore).toHaveBeenCalledWith(input.Email);
    });
  });

  describe('storeAndSendOTP', () => {
    it('should store OTP and send it via email', async () => {
      const email = 'test@example.com';
      const OTP = '123456';

      const result = await service.storeAndSendOTP(email, OTP);

      expect(result).toHaveBeenCalledWith(email, OTP);
      expect(result).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should log in the user with valid credentials', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid credentials', async () => {
      // Test implementation
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with valid id', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid user id', async () => {
      // Test implementation
    });
  });

  describe('changeEmail', () => {
    it('should change user email and send verification OTP', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid user id or credentials', async () => {
      // Test implementation
    });
  });

  describe('changePassword', () => {
    it('should change user password with valid credentials', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid user id or credentials', async () => {
      // Test implementation
    });
  });

  describe('updateUser', () => {
    it('should update user information with valid id', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid user id', async () => {
      // Test implementation
    });
  });

  describe('getByEmail', () => {
    it('should get user by email', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid email', async () => {
      // Test implementation
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid user id', async () => {
      // Test implementation
    });
  });

  describe('updateVerifyEmailStatus', () => {
    it('should update verifyEmail status for given email', async () => {
      // Test implementation
    });

    it('should throw NotFoundException for invalid email', async () => {
      // Test implementation
    });
  });

  describe('validateOTP', () => {
    it('should validate OTP for given email', async () => {
      // Test implementation
    });

    it('should throw BadRequestException for invalid OTP', async () => {
      // Test implementation
    });
  });
});
