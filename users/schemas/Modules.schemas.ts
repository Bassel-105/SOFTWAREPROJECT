import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
  

export type ModuleDocument = Module & Document;

@Schema()
export class Module extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, default: function () { return this._id; }, unique: true })
  module_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  resources?: string[];

  @Prop({ required: true, type: Date, default: Date.now })
  created_at?: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);