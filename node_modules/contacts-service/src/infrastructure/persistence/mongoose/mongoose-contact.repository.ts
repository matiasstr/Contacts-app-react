import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongooseContactRepository {
  constructor(@InjectModel('Contact') private readonly model: Model<any>) {}

  async create(data: any) {
    return this.model.create(data);
  }

  async findAll(ownerId: string, filter: any = {}) {
    const q = { ownerId, ...filter };
    return this.model.find(q).sort({ createdAt: -1 }).lean();
  }

  async findByIdForOwner(id: string, ownerId: string) {
    return this.model.findOne({ _id: id, ownerId }).lean();
  }

  async updateForOwner(id: string, dto: any, ownerId: string) {
    const doc = await this.model.findOneAndUpdate({ _id: id, ownerId }, { $set: dto }, { new: true }).lean();
    return doc;
  }

  async deleteForOwner(id: string, ownerId: string) {
    const res = await this.model.findOneAndDelete({ _id: id, ownerId }).lean();
    return res;
  }

  async toggleFavorite(id: string, ownerId: string) {
    const doc = await this.model.findOne({ _id: id, ownerId });
    if (!doc) return null;
    doc.isFavorite = !doc.isFavorite;
    await doc.save();
    return doc.toObject();
  }
}
