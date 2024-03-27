import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRegisterInputDto } from './dto/UserInput.dto';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('UserController', () => {
    it('should register a user', async () => {
      const input: UserRegisterInputDto = {
        Fullname: 'testuser',
        Email: 'test@example.com',
        Password: 'password123',
      };

      const result = await controller.register(input);
      expect(typeof result.message).toEqual('string');
    });
  })
});
