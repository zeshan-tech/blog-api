import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthManager } from './token.manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from '../user/schema/user.schema';
import { Model } from 'mongoose';
import { MongoClient, GridFSBucket } from 'mongodb';

export class TestServer {
  public authToken: string;
  public app: INestApplication;
  public authManager: AuthManager;
  public httpServer: any;
  private testingModule: TestingModule;
  public gridFSBucket: GridFSBucket;

  async init(modules: any[]): Promise<void> {
    this.testingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'jwtConstants.secret',
          signOptions: { expiresIn: '1d' },
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const client = new MongoClient(configService.get('DB_URI'));
            await client.connect();
            const db = client.db(configService.get('TEST_DB'));
            this.gridFSBucket = new GridFSBucket(db);

            return {
              uri: configService.get('DB_URI'),
              dbName: configService.get('TEST_DB'),
            };
          },
          inject: [ConfigService],
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ...modules,
      ],
      controllers: [],
      providers: [AuthManager],
    }).compile();

    this.app = this.testingModule.createNestApplication();
    this.httpServer = await this.app.getHttpServer();
    this.authManager = this.testingModule.get<AuthManager>(AuthManager);
    this.app.enableCors();
    await this.app.init();
  }

  async close(): Promise<void> {
    await this.app.close();
  }

  async setup(modules: any[]) {
    await this.init(modules);
  }

  async insertTestData<T>(model: Model<T>, data: Record<string, any>): Promise<T[]> {
    try {
      console.log(model, data);

      return (await model.insertMany(data)) as T[];
    } catch (error) {
      throw new Error(error);
    }
  }
}
