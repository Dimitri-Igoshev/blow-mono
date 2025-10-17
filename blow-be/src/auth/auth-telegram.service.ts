// auth/auth-telegram.service.ts (патч ключевых мест)
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
    // type/newUser не участвуют в подписи
    const { type, newUser, ...rest } = dto as any;
    const dataCheckString = this.buildDataCheckString(rest as TelegramAuthDto);
    const secretKey = crypto
      .createHash('sha256')
      .update(this.botToken)
      .digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    return hmac === (dto as any).hash;
  }

  private verifyAuthDate(authDate: number) {
    const now = Math.floor(Date.now() / 1000);
    return now - authDate <= this.maxAgeSec;
  }

  // ... verify helpers без изменений ...

  /** Пытаемся выполнить fn в транзакции; если транзакции недоступны — возвращаем false (фоллбек наружу) */
  private async tryWithTransaction(
    fn: (session: ClientSession) => Promise<void>,
  ): Promise<boolean> {
    let session: ClientSession | null = null;
    try {
      session = await this.conn.startSession();
      await session.withTransaction(
        async () => {
          await fn(session!);
        },
        { writeConcern: { w: 'majority' } },
      );
      return true;
    } catch (e: any) {
      // code 20 или сообщение про Transaction numbers... — нет реплика-сета → фоллбек
      if (
        e?.code === 20 ||
        /Transaction numbers are only allowed/i.test(String(e?.message))
      ) {
        return false;
      }
      throw e;
    } finally {
      if (session) await session.endSession();
    }
  }

  async authenticate(dto: TelegramAuthDto, attachToUserId?: string) {
    if (!this.verifySignature(dto))
      throw new UnauthorizedException('Invalid Telegram signature');
    if (!this.verifyAuthDate((dto as any).auth_date))
      throw new UnauthorizedException('Telegram auth data expired');

    const tgId = String((dto as any).id);

    // ====== ATTACH (привязка при наличии Authorization) ======
    if (attachToUserId) {
      // 1) попытка в транзакции
      const doneInTxn = await this.tryWithTransaction(async (session) => {
        await this.userModel.updateMany(
          { telegramId: tgId, _id: { $ne: attachToUserId } },
          {
            $unset: { telegramId: 1, telegramUsername: 1, telegramPhotoUrl: 1 },
          },
          { session },
        );
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
        if (res.matchedCount === 0)
          throw new ConflictException('User not found for link');
      });

      // 2) фоллбек без транзакции
      if (!doneInTxn) {
        await this.userModel.updateMany(
          { telegramId: tgId, _id: { $ne: attachToUserId } },
          {
            $unset: { telegramId: 1, telegramUsername: 1, telegramPhotoUrl: 1 },
          },
        );
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
        if (res.matchedCount === 0)
          throw new ConflictException('User not found for link');
      }

      const linked = await this.userModel
        .findById(attachToUserId)
        .read('primary')
        .lean();
      const payload = {
        sub: linked!._id.toString(),
        role: linked!.role,
        status: linked!.status,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken, isNew: false, userId: linked!._id };
    }

    // ====== LOGIN / REGISTRATION / ADD ======
    let user = await this.userModel
      .findOne({ telegramId: tgId })
      .read('primary')
      .exec();
    if ((dto as any).type === 'login' && !user)
      return { error: 'User not found' };

    if (
      !user &&
      ((dto as any).type === 'registration' || (dto as any).type === 'add')
    ) {
      const didTxn = await this.tryWithTransaction(async (session) => {
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
      });

      if (!didTxn) {
        // фоллбек без транзакции
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
          user = await this.userModel.create(data);
        }
        if ((dto as any).type === 'add') {
          user = await this.userModel
            .findOneAndUpdate(
              { _id: (dto as any).newUser?._id },
              {
                $set: {
                  telegramId: tgId,
                  telegramUsername: (dto as any).username,
                  telegramPhotoUrl: (dto as any).photo_url,
                },
              },
              { new: true },
            )
            .exec();
        }
      }

      if (!user) {
        user = await this.userModel
          .findOne({ telegramId: tgId })
          .read('primary')
          .exec();
      }
    }

    if (!user) return { error: 'User not found' };

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
