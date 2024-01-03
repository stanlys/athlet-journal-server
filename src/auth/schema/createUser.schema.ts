import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bc from 'bcrypt';

export type CatDocument = UserEntity & Document;

@Schema()
export class UserEntity {
  @Prop()
  userName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
UserEntitySchema.pre<UserEntity>('save', async function (next) {
  this.password = await bc.hash(this.password, 10);
  next();
});
