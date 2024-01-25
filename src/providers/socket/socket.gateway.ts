import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({
  cors: true,
  path: '/socket.io',
  transports: ['websocket'],
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  emit(event: string, data: string) {
    this.server.emit(event, data);
  }
}
