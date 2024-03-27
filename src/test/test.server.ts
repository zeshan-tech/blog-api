import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TokenManager } from './token.manager';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/user/user.controller';

export class TestServer {
  public authToken: string;
  public app: INestApplication;
  public tokenManager: TokenManager;
  public httpServer: any;

  private readonly logger = new Logger(TokenManager.name);
  constructor(private readonly userController: UserController) {}

  async init(modules: any[]): Promise<void> {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/posts'),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ...modules,
      ],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();
    this.tokenManager = moduleFixture.get<TokenManager>(TokenManager);

    this.app = moduleFixture?.createNestApplication();
    this.httpServer = await this.app.getHttpServer();
    this.tokenManager = moduleFixture.get<TokenManager>(TokenManager);
    this.app.enableCors();
    await this.app.init();
  }

  async close(): Promise<void> {
    await this.app.close();
  }

  async setup(modules: any[]) {
    await this.init(modules);
  }

  async insertIntoTable(tableName: string, data: any) {}

  async retrieveToken() {
    const input = {
      Email: process.env.TEST_USER_EMAIL,
      Password: process.env.TEST_USER_PASSWORd,
    };
    const { token } = await this.userController.login(input);
    this.logger.log(token);
    this.authToken = token;
  }
}
