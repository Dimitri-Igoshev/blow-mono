import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Ip,
  Req,
  HostParam,
  Query,
  Headers,
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RealIP } from 'nestjs-real-ip';
import { LoginDto } from './dto/login.dto';
import { AuthTelegramService } from './auth-telegram.service';
import { JwtService } from '@nestjs/jwt';
import type { TelegramAuthDto } from './dto/telegram-auth.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authTelegram: AuthTelegramService,
    private readonly jwtService: JwtService,
  ) {}

  // @Get('get-ip')
  // get(@RealIP() ip: string, @Req() req: any): string {
  //   console.log(req);
  //   return ip;
  // }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('registration')
  register(@Body() data: LoginDto) {
    return this.authService.registration(data);
  }

  @Post('confirmation')
  confirmation(@Body() data: { token: string }) {
    return this.authService.confirmation(data.token);
  }

  @Post('recovery-password')
  recovery(@Body() data: { email: string }) {
    return this.authService.recoveryPassword(data.email);
  }

  @Post('reset-password')
  reset(@Body() data: { password: string; token: string }) {
    return this.authService.resetPassword(data.password, data.token);
  }

  @Post('telegram')
  async telegram(
    @Body() dto: TelegramAuthDto,
    @Headers('authorization') authorization?: string,
  ) {
    console.log(1, dto, authorization);
    let attachToUserId: string | undefined;

    if (authorization?.startsWith('Bearer ')) {
      // Пытаемся связать Telegram с текущим аккаунтом
      const token = authorization.substring('Bearer '.length);
      try {
        const decoded = this.jwtService.verify(token);
        attachToUserId = decoded.sub;
      } catch {
        throw new UnauthorizedException('Invalid bearer token for link');
      }
    }

    console.log(2, dto, attachToUserId);
    return this.authTelegram.authenticate(dto, attachToUserId);
  }
}
