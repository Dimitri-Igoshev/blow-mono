import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { CommonModule } from './common/common.module';
import { TransactionModule } from './transaction/transaction.module';
import { ServicesModule } from './services/services.module';
import { ChatModule } from './chat/chat.module';
import { MailingModule } from './mailing/mailing.module';
import { PaymentModule } from './payment/payment.module';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ClaimModule } from './claim/claim.module';
import { TopUpModule } from './top-up/top-up.module';
import { CityModule } from './city/city.module';
import { SessionModule } from './session/session.module';
import { GuestModule } from './guest/guest.module';
import { EmailingModule } from './emailing/emailing.module';
import { ActivitySchedulerModule } from './activity-scheduler/activity-scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { SaleModule } from './sale/sale.module';
import { YoomoneyModule } from './yoomoney/yoomoney.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://mongo:27017/blow',
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('MAIL_HOST');
        const port = Number(config.get<string>('MAIL_PORT') ?? 587);
        const secure = config.get<string>('MAIL_SECURE') === 'true' || port === 465;
        const requireTLS = config.get<string>('MAIL_REQUIRE_TLS');
        const requireTlsValue =
          requireTLS !== undefined ? requireTLS === 'true' : !secure;
        const user = config.get<string>('MAIL_USER');
        const pass = config.get<string>('MAIL_PASS');
        const from = config.get<string>('MAIL_FROM') ?? '"No Reply" <no-reply@example.com>';

        return {
          transport: {
            host: host ?? 'smtp.example.com',
            port,
            requireTLS: requireTlsValue,
            secure,
            auth:
              user && pass
                ? {
                    user,
                    pass,
                  }
                : undefined,
            connectionTimeout: Number(config.get<string>('MAIL_CONNECTION_TIMEOUT') ?? 10000),
          },
          defaults: {
            from,
          },
          preview: false,
          template: {
            dir: process.cwd() + '/template/',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    MailModule,
    UserModule,
    FileModule,
    CommonModule,
    TransactionModule,
    ServicesModule,
    ChatModule,
    MailingModule,
    PaymentModule,
    HttpModule,
    ClaimModule,
    TopUpModule,
    CityModule,
    SessionModule,
    GuestModule,
    EmailingModule,
    ActivitySchedulerModule,
    ScheduleModule.forRoot(),
    WithdrawalModule,
    SaleModule,
    YoomoneyModule,
    WalletModule,
  ],
})
export class AppModule {}
