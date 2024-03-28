import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { ConfigService } from '@nestjs/config';

const sendGridService = {
  send: jest.fn(),
};

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService, ConfigService, { provide: SendGridService, useValue: sendGridService }],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should send mail', async () => {
    const email = 'test@example.com';
    const OTP = '123456';

    jest.spyOn(sendGridService, 'send').mockResolvedValueOnce(null);

    await service.sendOTP(email, OTP);
    expect(sendGridService.send).toHaveBeenCalled();
  });
});
