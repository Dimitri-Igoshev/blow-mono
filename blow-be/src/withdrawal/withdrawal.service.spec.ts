import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalService } from './withdrawal.service';

describe('WithdrawalService', () => {
  let service: WithdrawalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WithdrawalService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<WithdrawalService>(WithdrawalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
