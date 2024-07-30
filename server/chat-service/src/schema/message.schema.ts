import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Conversations } from './conversation.schema';
import { Members } from './member.schema';

export type MessagesDocument = HydratedDocument<Messages>;

export enum typeMessage {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LOCATION = 'LOCATION',
}

@Schema({ timestamps: true })
export class Messages {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversations' })
  conversationId: string | Conversations;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Members.name })
  createdBy: string | Members;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Members.name })
  senders: string[] | Members[];

  @Prop({ type: mongoose.Schema.Types.String })
  content: string;

  @Prop({ type: String, enum: typeMessage })
  type: typeMessage;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MessagesSchema = SchemaFactory.createForClass(Messages);
