import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Post('register')
  register(@Body() body: any): Observable<any> {
    return this.client.send('auth.registerLocalUser', body);
  }

  @Post('login')
  login(@Body() body: any): Observable<any> {
    return this.client.send('auth.loginLocalUser', body);
  }

  @Post('firebase/session')
  firebaseSession(@Body() body: any): Observable<any> {
    return this.client.send('auth.syncFirebaseUser', body);
  }

  @Get('me')
  me(@Req() req: any): Observable<any> {
    const token = req.headers.authorization?.split(' ')[1];
    return this.client.send('auth.getCurrentUser', { token });
  }
}
