import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { MailerService } from '../mailer/mailer.service';
import { RedisService } from '../redis/redis.service';
import { onHashPassword } from '../common/utils/bcrypt';

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
      emailVerified: true,
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

      jest.spyOn(service, 'validateOTP').mockResolvedValueOnce(undefined);
      jest.spyOn(service, 'updateVerifyEmailStatus').mockResolvedValueOnce(undefined);

      const result = await service.verifyEmail(input);

      expect(result).toEqual({ isSuccess: true });
    });

    it('should throw error if OTP is invalid or expired', async () => {
      const input = {
        Email: 'test@example.com',
        OTP: 'invalidOTP',
      };
      jest.spyOn(service, 'validateOTP').mockRejectedValueOnce(new Error('Invalid OTP'));

      await expect(service.verifyEmail(input)).rejects.toThrow('Invalid OTP');
    });
  });

  describe('storeAndSendOTP', () => {
    it('should store OTP and send it via email', async () => {
      const email = 'test@example.com';
      const OTP = '123456';

      jest.spyOn(redisServiceMock, 'storeValueInTempStore').mockResolvedValueOnce(undefined);
      jest.spyOn(mailerServiceMock, 'sendOTP').mockResolvedValueOnce(undefined);

      await service.storeAndSendOTP(email, OTP);
      expect(redisServiceMock.storeValueInTempStore).toHaveBeenCalled();
      expect(mailerServiceMock.sendOTP).toHaveBeenCalled();
    });

    it('should throw error if failed to store OTP or send email', async () => {
      const email = 'test@example.com';
      const OTP = '123456';
      jest.spyOn(redisServiceMock, 'storeValueInTempStore').mockRejectedValueOnce(new Error('Failed to store OTP'));
      jest.spyOn(mailerServiceMock, 'sendOTP').mockRejectedValueOnce(new Error('Failed to send OTP via email'));

      await expect(service.storeAndSendOTP(email, OTP)).rejects.toThrow('Failed to store OTP');
      await expect(service.storeAndSendOTP(email, OTP)).rejects.toThrow('Failed to send OTP via email');
    });
  });

  describe('login', () => {
    it('should log in the user with valid credentials', async () => {
      const input = {
        Email: 'test@example.com',
        Password: 'password',
      };

      const expectedUser = {
        ...userMock,
        password: await onHashPassword(input.Password),
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(expectedUser as any);

      const result = await service.login(input);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error if login credentials are invalid', async () => {
      const input = {
        Email: 'test@example.com',
        Password: 'incorrectPassword',
      };
      jest.spyOn(userModelMock, 'findOne').mockResolvedValueOnce(null);

      await expect(service.login(input)).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with valid id', async () => {
      const userId = 'validUserId';
      jest.spyOn(userModelMock, 'findByIdAndDelete').mockResolvedValueOnce({ _id: userId });

      const result = await service.deleteUser(userId);

      expect(result).toEqual({ isSuccess: true });
      expect(userModelMock.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });

    it('should throw Error', async () => {
      const invalidUserId = 'invalid_id';

      await expect(service.deleteUser(invalidUserId)).rejects.toThrow();
      expect(userModelMock.findByIdAndDelete).toHaveBeenCalledWith(invalidUserId);
    });
  });

  describe('changeEmail', () => {
    it('should change user email and send verification OTP', async () => {
      const userId = 'validUserId';
      const input = { NewEmail: 'new@example.com', Password: 'password' };

      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce({
        ...userMock,
        password: await onHashPassword(input.Password),
      });
      jest.spyOn(service, 'storeAndSendOTP').mockResolvedValueOnce(undefined);
      jest.spyOn(userModelMock, 'findOneAndUpdate').mockResolvedValueOnce(null);

      const result = await service.changeEmail(input, userId);

      expect(result).toEqual(expect.objectContaining({ message: expect.any(String) }));
      expect(userModelMock.findOneAndUpdate).toHaveBeenCalled();
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
      expect(service.storeAndSendOTP).toHaveBeenCalledWith(input.NewEmail, expect.any(String));
    });

    it('should throw Error', async () => {
      const userId = 'invalidUserId';
      const input = { NewEmail: 'new@example.com', Password: 'password' };
      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce(null);

      await expect(service.changeEmail(input, userId)).rejects.toThrow();
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('changePassword', () => {
    it('should change user password with valid credentials', async () => {
      const userId = 'validUserId';
      const input = { Password: 'oldPassword', NewPassword: 'newPassword' };

      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce({
        ...userMock,
        password: await onHashPassword(input.Password),
      });
      jest.spyOn(userModelMock, 'findOneAndUpdate').mockResolvedValueOnce(null);

      const result = await service.changePassword(input, userId);

      expect(result).toEqual({ isSuccess: true });
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
      expect(userModelMock.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw Error', async () => {
      const userId = 'invalidUserId';
      const input = { Password: 'oldPassword', NewPassword: 'newPassword' };
      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce(null);

      await expect(service.changePassword(input, userId)).rejects.toThrow();
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateUser', () => {
    it('should update user information with valid id', async () => {
      const userId = 'validUserId';
      const input = { Fullname: 'New Name' };

      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce(userMock);
      jest.spyOn(userModelMock, 'findOneAndUpdate').mockResolvedValueOnce(null);

      const result = await service.updateUser(input, userId);

      expect(result).toEqual({ isSuccess: true });
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
      expect(userModelMock.findOneAndUpdate).toHaveBeenCalledWith({ _id: userId }, { $set: { fullname: input.Fullname } });
    });

    it('should throw Error', async () => {
      const userId = 'invalidUserId';
      const input = { Fullname: 'New Name' };

      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce(null);

      await expect(service.updateUser(input, userId)).rejects.toThrow();
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('getByEmail', () => {
    it('should get user by email', async () => {
      const email = 'example@example.com';

      jest.spyOn(userModelMock, 'findOne').mockResolvedValueOnce(userMock);

      const result = await service.getByEmail(email);

      expect(result).toEqual(userMock);
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email });
    });

    it('should throw Error', async () => {
      const email = 'invalid@example.com';
      jest.spyOn(userModelMock, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getByEmail(email)).rejects.toThrow();
      expect(userModelMock.findOne).toHaveBeenCalledWith({ email });
    });
  });

  describe('getUserById', () => {
    it('should get user by id', async () => {
      const userId = 'validUserId';

      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce(userMock);

      const result = await service.getUserById(userId);

      expect(result).toEqual(userMock);
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw Error', async () => {
      const userId = 'invalidUserId';
      jest.spyOn(userModelMock, 'findById').mockResolvedValueOnce(null);

      await expect(service.getUserById(userId)).rejects.toThrow();
      expect(userModelMock.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateVerifyEmailStatus', () => {
    it('should update verifyEmail status for given email', async () => {
      const email = 'test@example.com';
      jest.spyOn(userModelMock, 'findOneAndUpdate').mockResolvedValueOnce(userMock);

      await service.updateVerifyEmailStatus(email);

      expect(userModelMock.findOneAndUpdate).toHaveBeenCalledWith({ email }, { $set: { emailVerified: true } });
    });

    it('should throw Error', async () => {
      const email = 'invalid@example.com';
      jest.spyOn(userModelMock, 'findOneAndUpdate').mockResolvedValueOnce(null);

      await expect(service.updateVerifyEmailStatus(email)).rejects.toThrow();
    });
  });

  describe('validateOTP', () => {
    it('should validate OTP for given email', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      jest.spyOn(redisServiceMock, 'getValueFromTempStore').mockResolvedValueOnce(otp);

      const result = await service.validateOTP(email, otp);

      expect(result).toBeUndefined();
      expect(redisServiceMock.getValueFromTempStore).toHaveBeenCalledWith(email);
    });

    it('should throw Error', async () => {
      const email = 'test@example.com';
      const otp = 'invalidOTP';
      jest.spyOn(redisServiceMock, 'getValueFromTempStore').mockResolvedValueOnce('validOTP');

      await expect(service.validateOTP(email, otp)).rejects.toThrow();
      expect(redisServiceMock.getValueFromTempStore).toHaveBeenCalledWith(email);
    });
  });
});
