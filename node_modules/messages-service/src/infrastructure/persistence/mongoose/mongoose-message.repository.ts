import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongooseMessageRepository {
  constructor(@InjectModel('Message') private readonly model: Model<any>) {}

  async create(data: any) {
    return this.model.create(data);
  }

  async findConversation(participants: string[]) {
    // participants: [userAId, userBId]
    return this.model
      .find({ $or: [{ from: participants[0], to: participants[1] }, { from: participants[1], to: participants[0] }] })
      .sort({ createdAt: 1 })
      .lean();
  }
}
