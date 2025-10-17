import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, type UserDocument } from 'src/user/entities/user.entity'

export interface SendOptions {
  parse_mode?: 'Markdown' | 'MarkdownV2' | 'HTML';
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
}

@Injectable()
export class TelegramService {
  // лучше вынести в env: process.env.TELEGRAM_BOT_TOKEN
  private readonly botToken = '8254626529:AAHYHbwlfVoFhdRW9awv_LtFQv260yynbsA';
  private readonly apiBase = `https://api.telegram.org/bot${this.botToken}`;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly http: HttpService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Отправить сообщение напрямую по telegramId
   */
  async sendToTelegramId(
    telegramId: string | number,
    text: string,
    opts: SendOptions = {},
  ): Promise<boolean> {
    try {
      const payload: any = {
        chat_id: String(telegramId),
        text,
        ...opts,
      };

      const { data } = await firstValueFrom(
        this.http.post(`${this.apiBase}/sendMessage`, payload),
      );

      if (data?.ok) return true;

      this.logger.warn(`Telegram sendMessage not ok: ${JSON.stringify(data)}`);
      return false;
    } catch (e: any) {
      this.logger.error(
        `Failed to send Telegram message to ${telegramId}: ${e?.message}`,
      );
      return false;
    }
  }

  /**
   * Отправить сообщение пользователю по его userId из БД,
   * если у него есть telegramId. Вернёт false, если телеги нет.
   */
  async sendToUserId(
    userId: string,
    text: string,
    opts: SendOptions = {},
  ): Promise<boolean> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      this.logger.warn(`User not found: ${userId}`);
      return false;
    }
    if (!user.telegramId) {
      this.logger.warn(`User ${userId} has no telegramId`);
      return false;
    }
    return this.sendToTelegramId(user.telegramId, text, opts);
    }
}

