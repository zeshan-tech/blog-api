import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class GridFsService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private gridFSBucket: GridFSBucket;

  private readonly logger = new Logger(GridFsService.name);
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new MongoClient(this.configService.get<string>('DB_URI'));
    await this.client.connect();
    const db = this.client.db(this.configService.get<string>('DB_NAME'));
    this.gridFSBucket = new GridFSBucket(db);
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async saveContentToGridFS(content: string): Promise<string> {
    try {
      const binaryData = Buffer.from(content, 'utf-8');
      const fileName = 'content.txt';
      fs.writeFileSync(fileName, binaryData);

      const readStream = fs.createReadStream(fileName);
      const uploadStream = this.gridFSBucket.openUploadStream(`content.${uuid()}.txt`);
      readStream.pipe(uploadStream);

      const uploadedFileId = await new Promise<string>((resolve, reject) => {
        uploadStream.on('finish', () => {
          fs.unlinkSync(fileName);
          resolve(uploadStream.id.toString());
        });
        uploadStream.on('error', reject);
      });

      this.logger.log('Content saved to GridFS');
      return uploadedFileId;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteContentById(fileId: string): Promise<void> {
    try {
      const objectId = new ObjectId(fileId);
      await this.gridFSBucket.delete(objectId);
      this.logger.log(`Content file with ID ${fileId} deleted successfully.`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
