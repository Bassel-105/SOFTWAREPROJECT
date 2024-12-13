import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


export type ResponseDocument = Response & Document;


@Schema()
export class Response extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, default: function () { return this._id; }, unique: true })
  response_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  quiz_id: string;

  @Prop({ type: [Object], required: true })
  answers: Record<string, any>[];

  @Prop({ required: true })
  score: number;

  @Prop({ required: true, type: Date, default: Date.now })
  submitted_at?: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
