import { Inject } from '@nestjs/common';
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
import { MessageCreateDto } from '../messages/dto/message-create.dto';
import { MessageService } from '../messages/message.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

interface UserSocket {
  [key: string]: Socket[];
}
interface SocketClient {
  [key: string]: number; // userId
}

@WebSocketGateway(80, { transports: ['websocket'] })
export class WebsocketService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  userSocket: UserSocket = {};
  clients: SocketClient = {};

  constructor(
    @Inject(AuthService.AUTH_SERVICE) private authServiceClient: ClientProxy,
    private messageService: MessageService,
  ) {
    console.log('[WebsocketService]:', 'Init');
  }

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
  async handleEvent(
    @MessageBody() body: MessageCreateDto,
    @ConnectedSocket() client: Socket,
  ) {
    // Validate body dto
    // const dto = plainToInstance(MessageCreateDto, body);
    // const errors = await validate(dto);

    // if (errors.length) {
    //   return 'Error';
    // }

    const data = this.messageService.createMessage(
      body,
      this.clients[client.id],
    );
    return this.server.send(SUBSCRIBE_MESSAGE.RECEIVE_MESSAGE, data);
  }
}
