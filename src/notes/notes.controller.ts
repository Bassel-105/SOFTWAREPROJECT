// src/notes/notes.controller.ts

import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto } from './dto';
import { Note } from './note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  async findAll(@Query('userId') userId: string): Promise<Note[]> {
    return this.notesService.findAll(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto): Promise<Note> {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Note> {
    return this.notesService.delete(id);
  }
}