import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Members } from './member.schema';
import { Messages } from './message.schema';
import * as mongoose from 'mongoose';

export type ConversationsDocument = mongoose.HydratedDocument<Conversations>;

@Schema({ timestamps: true })
export class Conversations {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Members.name })
  members: string[] | Members[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Messages.name })
  lastMessage: string | Messages;

  @Prop({ type: String, default: undefined })
  name: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ConversationsSchema = SchemaFactory.createForClass(Conversations);
