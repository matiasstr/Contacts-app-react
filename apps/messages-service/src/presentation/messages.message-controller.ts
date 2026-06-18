import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MongooseMessageRepository } from '../infrastructure/persistence/mongoose/mongoose-message.repository';

@Controller()
export class MessagesController {
  constructor(private readonly repo: MongooseMessageRepository) {}

  @MessagePattern('messages.send')
  async send(payload: any) {
    // payload: { from, to, content }
    return this.repo.create(payload);
  }

  @MessagePattern('messages.history')
  async history(payload: any) {
    return this.repo.findConversation(payload.participants);
  }
}
