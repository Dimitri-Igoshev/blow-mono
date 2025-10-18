// auth/auth-telegram.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model, ClientSession } from 'mongoose';
import {
  User,
  UserRole,
  UserStatus,
  type UserDocument,
} from 'src/user/entities/user.entity';
import { stripNil } from 'src/common/utils/stripNil'

@Injectable()
export class AuthTelegramService {
  private readonly botToken = '8254626529:AAHYHbwlfVoFhdRW9awv_LtFQv260yynbsA';
  private readonly maxAgeSec = 120;

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

  /** Пытаемся выполнить fn в транзакции; если транзакции недоступны — возвращаем false (фоллбек без транзакции) */
  private async tryWithTransaction(
    fn: (session: ClientSession) => Promise<void>,
  ): Promise<boolean> {
    let session: ClientSession | null = null;
    try {
      session = await this.conn.startSession();
      await session.withTransaction(async () => { await fn(session!); }, { writeConcern: { w: 'majority' } });
      return true;
    } catch (e: any) {
      if (e?.code === 20 || /Transaction numbers are only allowed/i.test(String(e?.message))) {
        return false; // нет реплика-сета
      }
      throw e;
    } finally {
      if (session) await session.endSession();
    }
  }

  async authenticate(dto: TelegramAuthDto, attachToUserId?: string) {
    if (!this.verifySignature(dto)) throw new UnauthorizedException('Invalid Telegram signature');
    if (!this.verifyAuthDate((dto as any).auth_date)) throw new UnauthorizedException('Telegram auth data expired');

    const tgId = String((dto as any).id);
    const flow = (dto as any).type as 'login' | 'registration' | 'add' | undefined;

    // ====== ATTACH (привязка по Authorization) ======
    if (attachToUserId) {
      // (3) Если этот telegramId уже привязан к другому пользователю — конфликт
      const existingWithTg = await this.userModel
        .findOne({ telegramId: tgId })
        .read('primary')
        .lean();

      if (existingWithTg && existingWithTg._id.toString() !== attachToUserId) {
        throw new ConflictException('Нельзя привязать: этот Telegram уже связан с другим пользователем');
      }

      // Пишем (с транзакцией или без)
      const doneInTxn = await this.tryWithTransaction(async (session) => {
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
          throw new NotFoundException('User not found for link');
        }
      });

      if (!doneInTxn) {
        const res = await this.userModel.updateOne(
          { _id: attachToUserId },
          {
            $set: {
              telegramId: tgId,
              telegramUsername: (dto as any).username,
              telegramPhotoUrl: (dto as any).photo_url,
            },
          },
        );
        if (res.matchedCount === 0) throw new NotFoundException('User not found for link');
      }

      const linked = await this.userModel.findById(attachToUserId).read('primary').lean();
      const payload = { sub: linked!._id.toString(), role: linked!.role, status: linked!.status };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken, isNew: false, userId: linked!._id };
    }

    // ====== LOGIN / REGISTRATION / ADD (без Authorization) ======
    let user = await this.userModel.findOne({ telegramId: tgId }).read('primary').exec();

    // (1) Логин: если не найден — 404
    if (flow === 'login' && !user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // (2) Регистрация: если уже существует — 409
    if (flow === 'registration' && user) {
      throw new ConflictException('Пользователь уже существует');
    }

    // ADD: привязка к конкретному _id из dto.newUser — конфликт, если tgId у другого
    if (flow === 'add') {
      const targetId = (dto as any).newUser?._id;
      if (!targetId) throw new UnauthorizedException('Invalid target for add');

      if (user && user._id.toString() !== String(targetId)) {
        throw new ConflictException('Нельзя привязать: этот Telegram уже связан с другим пользователем');
      }
    }

    // Создание/обновление при registration | add
    if (!user && (flow === 'registration' || flow === 'add')) {
      const didTxn = await this.tryWithTransaction(async (session) => {
        if (flow === 'registration') {
          const data: any = {
            telegramId: tgId,
            telegramUsername: (dto as any).username,
            telegramPhotoUrl: (dto as any).photo_url,
            firstName: (dto as any).first_name,
            lastName: (dto as any).last_name,
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            email: Date.now() + '@example.com',
            ...(dto as any).newUser,
          };
          const doc = new this.userModel(data);
          await doc.save({ session });
          user = doc;
        } else if (flow === 'add') {
          const targetId = (dto as any).newUser?._id;
          const updated = await this.userModel.findOneAndUpdate(
            { _id: targetId },
            {
              $set: {
                telegramId: tgId,
                telegramUsername: (dto as any).username,
                telegramPhotoUrl: (dto as any).photo_url,
              },
            },
            { new: true, session },
          );
          if (!updated) throw new NotFoundException('Target user not found for add');
          user = updated;
        }
      });

      if (!didTxn) {
        if (flow === 'registration') {
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
          user = await this.userModel.create(data);
        } else if (flow === 'add') {
          const targetId = (dto as any).newUser?._id;
          user = await this.userModel.findOneAndUpdate(
            { _id: targetId },
            {
              $set: {
                telegramId: tgId,
                telegramUsername: (dto as any).username,
                telegramPhotoUrl: (dto as any).photo_url,
              },
            },
            { new: true },
          ).exec();
          if (!user) throw new NotFoundException('Target user not found for add');
        }
      }
    }

    // к этому моменту:
    // - login: user найден и мы выдаём токен
    // - registration: user только что создан
    // - add: user обновлён/прочитан
    if (!user) {
      // страхующий кейс (например, flow не указан)
      throw new NotFoundException('Пользователь не найден');
    }

    const payload = { sub: user._id.toString(), role: user.role, status: user.status };
    const accessToken = await this.jwtService.signAsync(payload);
    const isNew = flow === 'registration';
    return { accessToken, isNew, userId: user._id };
  }
}
