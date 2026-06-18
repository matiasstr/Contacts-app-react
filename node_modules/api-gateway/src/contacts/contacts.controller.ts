import { Controller, Get, Post, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('contacts')
export class ContactsController {
  constructor(@Inject('CONTACTS_SERVICE') private readonly client: ClientProxy) {}

  @Get()
  findAll(@Req() req: any): Observable<any> {
    return this.client.send('contacts.findAll', { ownerId: req.user?.uid || req.user?.sub });
  }

  @Get(':id')
  findById(@Param('id') id: string, @Req() req: any): Observable<any> {
    return this.client.send('contacts.findById', { id, ownerId: req.user?.uid || req.user?.sub });
  }

  @Post()
  create(@Body() dto: any, @Req() req: any): Observable<any> {
    return this.client.send('contacts.create', { ...dto, ownerId: req.user?.uid || req.user?.sub });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req: any): Observable<any> {
    return this.client.send('contacts.update', { id, dto, ownerId: req.user?.uid || req.user?.sub });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any): Observable<any> {
    return this.client.send('contacts.delete', { id, ownerId: req.user?.uid || req.user?.sub });
  }

  @Patch(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Req() req: any): Observable<any> {
    return this.client.send('contacts.toggleFavorite', { id, ownerId: req.user?.uid || req.user?.sub });
  }
}
