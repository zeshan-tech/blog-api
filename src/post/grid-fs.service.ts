import { Injectable, OnModuleInit, OnModuleDestroy, Logger, NotFoundException } from '@nestjs/common';
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

  async saveOrUpdateContent(content: Buffer, fileId?: string): Promise<string> {
    try {
      if (fileId) {
        await this.deleteContentById(fileId);
      }

      const fileName = 'content.txt';
      fs.writeFileSync(fileName, content);

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

  async getContentById(fileId: string): Promise<Buffer> {
    try {
      const objectId = new ObjectId(fileId);
      const downloadStream = this.gridFSBucket.openDownloadStream(objectId);
      return new Promise<Buffer>((resolve, reject) => {
        const chunks: any[] = [];
        downloadStream.on('data', (chunk) => chunks.push(chunk));
        downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
        downloadStream.on('error', reject);
      });
    } catch (error) {
      throw new NotFoundException('Content not found');
    }
  }

  async deleteContentById(fileId: string): Promise<void> {
    try {
      const objectId = new ObjectId(fileId);
      await this.gridFSBucket.delete(objectId);
      this.logger.log(`Content file with ID ${fileId} deleted successfully.`);
    } catch (error) {
      throw new NotFoundException('Content not found');
    }
  }

  async getAllContent(): Promise<{ id: string; content: Buffer }[]> {
    try {
      const cursor = this.gridFSBucket.find();
      const contentArray: Promise<{ id: string; content: Buffer }>[] = [];

      for await (const fileInfo of cursor) {
        const id = fileInfo._id.toString();
        const contentStream = this.gridFSBucket.openDownloadStream(fileInfo._id);
        const contentPromise: Promise<Buffer> = new Promise((resolve, reject) => {
          const chunks: any[] = [];
          contentStream.on('data', (chunk) => chunks.push(chunk));
          contentStream.on('end', () => resolve(Buffer.concat(chunks)));
          contentStream.on('error', reject);
        });
        contentArray.push(contentPromise.then((content) => ({ id, content })));
      }

      return Promise.all(contentArray);
    } catch (error) {
      throw new Error(error);
    }
  }
}
