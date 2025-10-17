// auth/auth-telegram.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
  import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  User,
  UserRole,
  UserStatus,
  type UserDocument,
} from 'src/user/entities/user.entity';

@Injectable()
export class AuthTelegramService {
  private readonly botToken = '8254626529:AAHYHbwlfVoFhdRW9awv_LtFQv260yynbsA';
  private readonly maxAgeSec = 120; // допустимое окно, 2 минуты

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectConnection() private readonly conn: Connection,
  ) {}

  private buildDataCheckString(dto: TelegramAuthDto) {
    const entries = Object.entries(dto)
      .filter(
        ([k]) => k !== 'hash' && dto[k as keyof TelegramAuthDto] !== undefined,
      )
      .map(([k, v]) => `${k}=${v}`)
      .sort();
    return entries.join('\n');
  }

  private verifySignature(dto: TelegramAuthDto) {
    // type/newUser не участвуют в подписи
    const { type, newUser, ...rest } = dto as any;
    const dataCheckString = this.buildDataCheckString(rest as TelegramAuthDto);
    const secretKey = crypto.createHash('sha256').update(this.botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    return hmac === (dto as any).hash;
  }

  private verifyAuthDate(authDate: number) {
    const now = Math.floor(Date.now() / 1000);
    return now - authDate <= this.maxAgeSec;
  }

  async authenticate(dto: TelegramAuthDto, attachToUserId?: string) {
    // 1) подпись
    if (!this.verifySignature(dto)) {
      throw new UnauthorizedException('Invalid Telegram signature');
    }
    // 2) окно времени
    if (!this.verifyAuthDate((dto as any).auth_date)) {
      throw new UnauthorizedException('Telegram auth data expired');
    }

    const tgId = String((dto as any).id);

    // ====== ВЕТКА ПРИВЯЗКИ (attach) — только если пришёл Authorization ======
    if (attachToUserId) {
      const session = await this.conn.startSession();
      try {
        await session.withTransaction(
          async () => {
            // Если у кого-то уже стоит этот telegramId — убираем (идемпотентно)
            await this.userModel.updateMany(
              { telegramId: tgId, _id: { $ne: attachToUserId } },
              { $unset: { telegramId: 1, telegramUsername: 1, telegramPhotoUrl: 1 } },
              { session },
            );

            // Ставим telegramId на целевого пользователя
            const res = await this.userModel.updateOne(
              { _id: attachToUserId },
              {
                $set: {
                  telegramId: tgId,
                  telegramUsername: (dto as any).username,
                  telegramPhotoUrl: (dto as any).photo_url,
                },
              },
              { session },
            );

            if (res.matchedCount === 0) {
              throw new ConflictException('User not found for link');
            }
          },
          // writeConcern для транзакции — гарантирует видимость сразу
          { writeConcern: { w: 'majority' } },
        );
      } finally {
        await session.endSession();
      }

      // Читаем свежие данные с primary
      const linked = await this.userModel.findById(attachToUserId).read('primary').lean();
      const payload = { sub: linked!._id.toString(), role: linked!.role, status: linked!.status };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken, isNew: false, userId: linked!._id };
    }

    // ====== ВЕТКА ЛОГИН/РЕГИСТРАЦИЯ/ADD (без Authorization) ======

    // Сразу пробуем найти по telegramId (на primary, чтобы видеть свежие привязки)
    let user = await this.userModel.findOne({ telegramId: tgId }).read('primary').exec();

    // Простой логин без регистрации
    if ((dto as any).type === 'login' && !user) {
      return { error: 'User not found' };
    }

    // Если нужно создать/добавить — делаем это в транзакции
    if (!user && ((dto as any).type === 'registration' || (dto as any).type === 'add')) {
      const session = await this.conn.startSession();
      try {
        await session.withTransaction(
          async () => {
            if ((dto as any).type === 'registration') {
              const data: any = {
                telegramId: tgId,
                telegramUsername: (dto as any).username,
                telegramPhotoUrl: (dto as any).photo_url,
                firstName: (dto as any).first_name,
                lastName: (dto as any).last_name,
                role: UserRole.USER,
                status: UserStatus.ACTIVE,
                ...(dto as any).newUser,
              };
              const doc = new this.userModel(data);
              await doc.save({ session });
              user = doc;
            }

            if ((dto as any).type === 'add') {
              const updated = await this.userModel.findOneAndUpdate(
                { _id: (dto as any).newUser?._id },
                {
                  $set: {
                    telegramId: tgId,
                    telegramUsername: (dto as any).username,
                    telegramPhotoUrl: (dto as any).photo_url,
                  },
                },
                { new: true, session },
              );
              user = updated ?? user;
            }
          },
          { writeConcern: { w: 'majority' } },
        );
      } finally {
        await session.endSession();
      }

      // перечитываем на primary, чтобы гарантировать свежие данные
      if (!user) {
        user = await this.userModel.findOne({ telegramId: tgId }).read('primary').exec();
      }
    }

    // К этому моменту user должен быть либо найден, либо создан/обновлён
    if (!user) {
      // на всякий случай — неожиданный кейс
      return { error: 'User not found' };
    }

    const payload = {
      sub: user._id.toString(),
      role: user.role,
      status: user.status,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const isNew = (dto as any).type === 'registration';
    return { accessToken, isNew, userId: user._id };
  }
}
