import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongooseUserRepository {
  constructor(@InjectModel('User') private readonly model: Model<any>) {}

  async findByEmail(email: string) {
    return this.model.findOne({ email }).lean();
  }

  async create(user: any) {
    return this.model.create(user);
  }

  async syncFirebaseUser(payload: any) {
    const { uid, email, displayName, photoURL } = payload;
    let user = await this.model.findOne({ firebaseUid: uid }).lean();
    if (!user) {
      user = await this.model.create({ firebaseUid: uid, email, displayName, photoUrl: photoURL, authProvider: 'firebase' });
    }
    return user;
  }
}
