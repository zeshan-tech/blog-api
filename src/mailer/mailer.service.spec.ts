import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { MailerService as NMailerService } from '@nestjs-modules/mailer';

const nMailerServiceMock = {
  sendMail: jest.fn(),
};

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerService, { provide: NMailerService, useValue: nMailerServiceMock }],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should send mail', async () => {
    const email = 'test@example.com';
    const OTP = '123456';

    jest.spyOn(nMailerServiceMock, 'sendMail').mockResolvedValueOnce(null);

    await service.sendOTP(email, OTP);
    expect(nMailerServiceMock.sendMail).toHaveBeenCalled();
  });
});
