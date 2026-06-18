import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MongooseContactRepository } from '../infrastructure/persistence/mongoose/mongoose-contact.repository';

@Controller()
export class ContactsMessageController {
  constructor(private readonly repo: MongooseContactRepository) {}

  @MessagePattern('contacts.create')
  async create(data: any) {
    return this.repo.create(data);
  }

  @MessagePattern('contacts.findAll')
  async findAll(query: any) {
    return this.repo.findAll(query.ownerId, query.filter || {});
  }

  @MessagePattern('contacts.findById')
  async findById(payload: any) {
    return this.repo.findByIdForOwner(payload.id, payload.ownerId);
  }

  @MessagePattern('contacts.update')
  async update(payload: any) {
    return this.repo.updateForOwner(payload.id, payload.dto, payload.ownerId);
  }

  @MessagePattern('contacts.delete')
  async remove(payload: any) {
    return this.repo.deleteForOwner(payload.id, payload.ownerId);
  }

  @MessagePattern('contacts.toggleFavorite')
  async toggleFavorite(payload: any) {
    return this.repo.toggleFavorite(payload.id, payload.ownerId);
  }
}
