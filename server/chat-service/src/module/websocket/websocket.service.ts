import { forwardRef, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService, UserReq } from 'src/const/const';
import { MESSAGE_PATTERN } from 'src/const/pattern';
import { SUBSCRIBE_MESSAGE } from 'src/const/socket';
import { toPromise } from 'src/helper';
import { Conversations } from 'src/schema/conversation.schema';
import { Members } from 'src/schema/member.schema';
import { MessageCreateDto } from '../messages/dto/message-create.dto';
import { MessageService } from '../messages/message.service';

interface UserSocket {
  [key: string]: Socket[];
}
interface SocketClient {
  [key: string]: number; // userId
}

@WebSocketGateway(8080, {
  transports: ['websocket'],
  cors: true,
})
export class WebsocketService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  userSocket: UserSocket = {}; // [user.id] => [socket]
  clients: SocketClient = {}; // [socket.id] => userId

  constructor(
    @Inject(AuthService.AUTH_SERVICE) private authServiceClient: ClientProxy,
    // @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token;
      // Gửi cho auth-service để tra token
      const user = await toPromise<UserReq>(
        this.authServiceClient.send(
          { cmd: MESSAGE_PATTERN.VERIFY_AUTH },
          token,
        ),
      );
      if (!this.userSocket[user.id]) {
        this.userSocket[user.id] = [];
      }
      this.userSocket[user.id].push(client);
      this.clients[client.id] = user.id;
      console.log('[WebsocketService]:', 'Connected', user.id);
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = this.clients[client.id];
      this.userSocket[userId] = this.userSocket[userId].filter(
        (socket) => socket.id !== client.id,
      );
      if (this.userSocket[userId].length === 0) {
        delete this.userSocket[userId];
      }
      delete this.clients[client.id];
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage(SUBSCRIBE_MESSAGE.CREATE_MESSAGE)
  async handleCreateMessage(
    @MessageBody() body: MessageCreateDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { message, conversation } = await this.messageService.createMessage(
      this.clients[client.id],
      body,
    );
    this.getSocketClientInConversation(conversation);
    return this.server
      .to(conversation['id'])
      .emit(SUBSCRIBE_MESSAGE.RECEIVE_MESSAGE, message);
  }

  private getSocketClientInConversation(conversation: Conversations) {
    (conversation.members as Members[]).forEach((member) => {
      if (this.userSocket[member.userId]) {
        console.log(member, 'ok');
        const sockets = this.userSocket[member.userId];
        for (let i = 0; i < sockets.length; i++) {
          if (!sockets[i].rooms.has(conversation['id'])) {
            sockets[i].join(conversation['id']);
          }
        }
      }
    });
  }

  async handleCreateConversation(conversation: Conversations) {
    this.getSocketClientInConversation(conversation);
    this.server
      .to(conversation['id'])
      .emit(SUBSCRIBE_MESSAGE.RECEIVE_CONVERSATION, conversation);
  }
}
