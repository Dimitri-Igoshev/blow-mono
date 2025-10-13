import { Test, TestingModule } from '@nestjs/testing';
import { YooMoneyController } from './yoomoney.controller';
import { YooMoneyOAuthService } from './yoomoney.oauth.service';
import { YooMoneyPaymentsService } from './yoomoney.payments.service';
import { WalletService } from '../wallet/wallet.service';

describe('YooMoneyController', () => {
  let controller: YooMoneyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YooMoneyController],
      providers: [
        {
          provide: YooMoneyOAuthService,
          useValue: {
            exchangeCode: jest.fn(),
          },
        },
        {
          provide: YooMoneyPaymentsService,
          useValue: {
            requestPayment: jest.fn(),
            processPayment: jest.fn(),
            operationDetails: jest.fn(),
          },
        },
        {
          provide: WalletService,
          useValue: {
            createPendingDeposit: jest.fn(),
            markDepositFailedByTxId: jest.fn(),
            attachPaymentId: jest.fn(),
            markDepositSucceededByPaymentId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<YooMoneyController>(YooMoneyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
