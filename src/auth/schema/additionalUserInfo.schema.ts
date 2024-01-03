import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IRole } from '../dto/updateUser.dto';
import { UserEntity, UserEntitySchema } from './createUser.schema';
import { Type } from 'class-transformer';

export type AdditionalUserInfoEntityDocument = AdditionalUserInfoEntity &
  Document;

@Schema()
export class AdditionalUserInfoEntity {
  @Prop({ type: UserEntitySchema, ref: 'UserEntity' })
  @Type(() => UserEntity)
  readonly user: UserEntity;

  @Prop()
  readonly login: string;

  @Prop()
  readonly city: string;

  @Prop()
  readonly icon: string;

  @Prop()
  readonly surname: string;

  @Prop()
  readonly role: IRole;
}

export const AdditionalUserInfoEntitySchema = SchemaFactory.createForClass(
  AdditionalUserInfoEntity,
);
