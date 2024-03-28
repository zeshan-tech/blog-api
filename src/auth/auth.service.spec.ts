import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schema/user.schema';
import { Types } from 'mongoose';

const jwtServiceMock = {
  sign: jest.fn(),
  decode: jest.fn(),
};

const userServiceMock = {
  isUserExistById: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: JwtService, useValue: jwtServiceMock }, { provide: UserService, useValue: userServiceMock }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error if user service throws error during authentication', async () => {
    const id = 'user_id';
    const errorMessage = 'User service error';

    userServiceMock.isUserExistById.mockRejectedValueOnce(errorMessage);

    await expect(service.authenticateUser(id)).rejects.toThrowError(errorMessage);
    expect(userServiceMock.isUserExistById).toHaveBeenCalledWith(id);
  });

  it('should throw error if JWT service fails to sign token', () => {
    const user = { _id: new Types.ObjectId(), email: 'test@example.com' } as User;

    jwtServiceMock.sign.mockImplementation(() => {
      throw new Error('JWT signing failed');
    });

    expect(() => service.signToken(user)).toThrowError('JWT signing failed');
    expect(jwtServiceMock.sign).toHaveBeenCalledWith({ email: user.email, _id: user._id });
  });

  it('should throw error if JWT service fails to decode token', () => {
    const token = 'invalid_token';

    jwtServiceMock.decode.mockImplementation(() => {
      throw new Error('JWT decoding failed');
    });

    expect(() => service.decodeToken(token)).toThrowError('JWT decoding failed');
    expect(jwtServiceMock.decode).toHaveBeenCalledWith(token);
  });
});
