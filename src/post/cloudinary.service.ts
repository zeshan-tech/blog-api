import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configure Cloudinary with credentials from config
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async saveOrUpdateContent(content: Buffer, fileId?: string): Promise<string> {
    try {
      if (fileId) {
        // If fileId exists, it means we're updating existing content
        // In that case, you might want to delete the old content first
        await this.deleteContentById(fileId);
      }

      // Convert buffer to Base64 string
      const base64String = content.toString('base64');

      // Upload new content to Cloudinary
      const result: UploadApiResponse = await cloudinary.uploader.upload(base64String, {
        public_id: filename,
        resource_type: 'raw',
      });

      // Return the public URL of the uploaded content
      return result.secure_url;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteContentById(fileId: string): Promise<void> {
    try {
      // Delete file from Cloudinary by fileId
      await cloudinary.uploader.destroy(fileId);
    } catch (error) {
      throw new Error(error);
    }
  }
}
