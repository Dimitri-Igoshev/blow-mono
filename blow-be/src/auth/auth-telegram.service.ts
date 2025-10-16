// auth/auth-telegram.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole, UserStatus, type UserDocument } from 'src/user/entities/user.entity'


@Injectable()
export class AuthTelegramService {
  private readonly botToken = '8254626529:AAHYHbwlfVoFhdRW9awv_LtFQv260yynbsA';
  private readonly maxAgeSec = 120; // допустимое окно, 2 минуты

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  private buildDataCheckString(dto: TelegramAuthDto) {
    const entries = Object.entries(dto)
      .filter(([k]) => k !== 'hash' && dto[k as keyof TelegramAuthDto] !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .sort();
    return entries.join('\n');
  }

  private verifySignature(dto: TelegramAuthDto) {
    const dataCheckString = this.buildDataCheckString(dto);
    const secretKey = crypto.createHash('sha256').update(this.botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    return hmac === dto.hash;
  }

  private verifyAuthDate(authDate: number) {
    const now = Math.floor(Date.now() / 1000);
    return now - authDate <= this.maxAgeSec;
  }

  async authenticate(dto: TelegramAuthDto, attachToUserId?: string) {
    // 1) сигнатура
    const ok = this.verifySignature(dto);
    if (!ok) throw new UnauthorizedException('Invalid Telegram signature');

    // 2) время
    if (!this.verifyAuthDate(dto.auth_date)) {
      throw new UnauthorizedException('Telegram auth data expired');
    }

    // 3) find or create by telegramId
    const tgId = String(dto.id);

    if (attachToUserId) {
      // режим линковки к существующему пользователю
      const existingWithTg = await this.userModel.findOne({ telegramId: tgId }).lean();
      if (existingWithTg && existingWithTg._id.toString() !== attachToUserId) {
        throw new ConflictException('This Telegram is already linked to another account');
      }

      await this.userModel.updateOne(
        { _id: attachToUserId },
        {
          $set: {
            telegramId: tgId,
            telegramUsername: dto.username,
            telegramPhotoUrl: dto.photo_url,
          },
        },
      );

      const linked = await this.userModel.findById(attachToUserId).lean();
      const payload = { sub: linked!._id.toString(), role: linked!.role, status: linked!.status };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken, isNew: false, userId: linked!._id };
    }

    // обычный вход/регистрация
    let user = await this.userModel.findOne({ telegramId: tgId });

    const isNew = !user;
    if (!user) {
      // создаём без email
      user = new this.userModel({
        telegramId: tgId,
        telegramUsername: dto.username,
        telegramPhotoUrl: dto.photo_url,
        firstName: dto.first_name,
        lastName: dto.last_name,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        // можно сгенерировать «технический» email, если где-то ожидается уникальность строки:
        // email: `tg_${tgId}@telegram.local`,
        // password: crypto.randomBytes(16).toString('hex'),
      });
      await user.save();
    }

    const payload = { sub: user._id.toString(), role: user.role, status: user.status };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, isNew, userId: user._id };
  }
}
