import { Test, TestingModule } from '@nestjs/testing';
import { YooMoneyService } from './yoomoney.service';

describe('YooMoneyService', () => {
  let service: YooMoneyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: YooMoneyService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<YooMoneyService>(YooMoneyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
