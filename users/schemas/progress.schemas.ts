import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
 


 @Schema()
export class Progress extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, default: function () { return this._id; }, unique: true })
  progress_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  completion_percentage: number;

  @Prop({ required: true, type: Date, default: Date.now })
  last_accessed: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);