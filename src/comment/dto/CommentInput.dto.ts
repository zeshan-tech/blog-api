import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentInputDto {
  @IsNotEmpty()
  @IsString()
  Text: string;

  @IsNotEmpty()
  @IsString()
  PostId: string;

  @IsOptional()
  @IsString()
  CommentId: string;
}

export class UpdateCommentInputDto {
  @IsOptional()
  @IsString()
  Text: string;

  @IsOptional()
  @IsString()
  PostId: string;
}
