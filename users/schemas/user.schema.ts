   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   import mongoose, { Document } from 'mongoose';
      


   export type UserDocument = User & Document
  

   
   export enum user_role {
    student = 'student',
    admin = 'admin',
    instructor = 'instructor',
  }
  
   @Schema()
   export class User extends Document {
     @Prop({ required: true })
     name: string;

     @Prop({ required: true, unique: true })
     email: string;

     @Prop({ required: true })
     password: string;

     @Prop({ required: true, unique: true })
     user_id: mongoose.Types.ObjectId;

     @Prop({ required: false })
     mfa_secret?: string

     @Prop({ required: true, enum: user_role })
     role: string
   
   }

   export const UserSchema = SchemaFactory.createForClass(User);