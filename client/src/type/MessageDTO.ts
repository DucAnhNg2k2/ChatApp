export interface MessageDTO {
  id: number;
  createTime: Date;
  type: string;
  text: string;
  userId?: number;
  conversationId?: number;
  avatar?: string;
  displayName?: string;
}
