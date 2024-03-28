import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostInputDto {
  @IsNotEmpty()
  @IsString()
  Title: string;

  @IsNotEmpty()
  @IsString()
  Content: Buffer;
}

export class UpdatePostInputDto {
  @IsOptional()
  @IsString()
  Title: string;

  @IsOptional()
  @IsString()
  Content: Buffer;
}
