// src/notes/note.schema.ts

import * as mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, required: true },  // Link to specific module
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});