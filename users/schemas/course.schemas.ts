import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Document } from 'mongoose';

export type CourseDocument = Course & Document;

enum difficulty_levels {
  beginner = 'beginner',
  intermediate = 'intermediate',
  advanced = 'advanced',
}

@Schema()
export class Course {
  @Prop({ type: mongoose.Schema.Types.ObjectId, default: function () { return this._id; }, unique: true })
  course_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: difficulty_levels })
  difficulty_level: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
  created_by: mongoose.Types.ObjectId

  @Prop({ required: true, type: Date, default: Date.now })
  created_at?: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], default: [] })
  enrolled_students?: mongoose.Schema.Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);