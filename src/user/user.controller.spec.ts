import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChangeEmailInputDto, ChangePasswordInputDto, LoginInputDto, UpdateUserInputDto, UserRegisterInputDto, VerifyEmailInputDto } from './dto/UserInput.dto';
import { RedisService } from '../redis/redis.service';
import { MailerService } from '../mailer/mailer.service';
import { AuthService } from '../auth/auth.service';
import { Types } from 'mongoose';
import { User } from './schema/user.schema';

// Mock dependencies
const userServiceMock = {
  register: jest.fn(),
  verifyEmail: jest.fn(),
  login: jest.fn(),
  deleteUser: jest.fn(),
  changePassword: jest.fn(),
  changeEmail: jest.fn(),
  updateUser: jest.fn(),
};

// Mock dependencies
const authServiceMock = {
  signToken: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;
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
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RedisService, useValue: {} },
        { provide: MailerService, useValue: {} },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user', async () => {
      const input: UserRegisterInputDto = { Fullname: 'testuser', Email: 'test@example.com', Password: 'password123' };

      jest.spyOn(userServiceMock, 'register').mockResolvedValueOnce({ message: 'test message' });

      const result = await controller.register(input);
      expect(typeof result.message).toEqual('string');
    });
  });

  // describe('login', () => {
  //   it('should login user', async () => {
  //     const input: LoginInputDto = {
  //       Email: 'test@example.com',
  //       Password: 'password123',
  //     };

  //     jest.spyOn(userServiceMock, 'login').mockResolvedValueOnce(userMock);
  //     jest.spyOn(authServiceMock, 'signToken').mockResolvedValueOnce('token');

  //     const result = await controller.login(input);
  //     expect(result.token).toEqual('token');
  //   });
  // });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const input: VerifyEmailInputDto = { Email: 'test@example.com', OTP: '123456' };

      jest.spyOn(userServiceMock, 'verifyEmail').mockResolvedValueOnce({ isSuccess: true });

      const result = await controller.verifyEmail(input);
      expect(result.isSuccess).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const input: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(userServiceMock, 'deleteUser').mockResolvedValueOnce({ isSuccess: true });

      const result = await controller.deleteUser(input);
      expect(result.isSuccess).toBe(true);
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      const input: ChangePasswordInputDto = { Password: 'password', NewPassword: 'password' };
      const user: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(userServiceMock, 'changePassword').mockResolvedValueOnce({ isSuccess: true });

      const result = await controller.changePassword(input, user);
      expect(result.isSuccess).toBe(true);
    });
  });

  describe('changeEmail', () => {
    it('should change email', async () => {
      const input: ChangeEmailInputDto = { Password: 'password', NewEmail: 'test@example.com' };
      const user: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(userServiceMock, 'changeEmail').mockResolvedValueOnce({ message: 'test message' });

      const result = await controller.changeEmail(input, user);
      expect(result.message).toBe('test message');
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const input: UpdateUserInputDto = { Fullname: 'test name' };
      const user: CurrentUserType = { email: 'test@example.com', _id: '100' };

      jest.spyOn(userServiceMock, 'updateUser').mockResolvedValueOnce({ isSuccess: true });

      const result = await controller.updateUser(input, user);
      expect(result.isSuccess).toBe(true);
    });
  });
});
