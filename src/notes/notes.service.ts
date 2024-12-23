// src/notes/notes.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { Note } from './note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel('Note') private noteModel: Model<Note>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll(userId: string): Promise<Note[]> {
    return this.noteModel.find({ userId }).exec();
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    return this.noteModel.findByIdAndUpdate(id, updateNoteDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Note> {
    return this.noteModel.findByIdAndRemove(id).exec();
  }
}