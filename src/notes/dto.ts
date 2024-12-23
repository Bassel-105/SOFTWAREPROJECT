// src/notes/dto.ts

export class CreateNoteDto {
    readonly title: string;
    readonly content: string;
    readonly userId: string;  // Assuming each note is linked to a specific user
  }
  
  export class UpdateNoteDto {
    readonly title?: string;
    readonly content?: string;
  }