import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from './mailing.service';

describe('MailingService', () => {
  let service: MailingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailingService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
