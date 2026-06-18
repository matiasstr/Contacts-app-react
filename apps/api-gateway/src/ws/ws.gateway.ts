import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@WebSocketGateway({ cors: true })
export class WsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(@Inject('MESSAGES_SERVICE') private readonly messagesClient: ClientProxy) {}

  handleConnection(client: Socket) {
    // expect token in auth
    const token = client.handshake.auth?.token;
    // minimal: attach user id from token to socket
    client.data.userId = token;
    this.server.emit('presence', { userId: client.data.userId, online: true });
  }

  handleDisconnect(client: Socket) {
    this.server.emit('presence', { userId: client.data.userId, online: false });
  }

  @SubscribeMessage('message.send')
  async onMessage(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    // payload: { to, content }
    const msg = await this.messagesClient.send('messages.send', { from: client.data.userId, to: payload.to, content: payload.content }).toPromise();
    this.server.to(payload.to).emit('message', msg);
    return msg;
  }

  @SubscribeMessage('message.history')
  async onHistory(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const conv = await this.messagesClient.send('messages.history', { participants: [client.data.userId, payload.with] }).toPromise();
    return conv;
  }
}
