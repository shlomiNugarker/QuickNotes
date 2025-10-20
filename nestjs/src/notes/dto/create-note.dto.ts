import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
