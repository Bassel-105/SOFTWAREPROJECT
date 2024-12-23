// src/notes/dto.ts

import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly userId: string;

  @IsNotEmpty()
  @IsMongoId()
  readonly moduleId: string;
}

export class UpdateNoteDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly content?: string;
}