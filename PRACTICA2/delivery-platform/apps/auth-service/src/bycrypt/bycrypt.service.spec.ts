import { Test, TestingModule } from '@nestjs/testing';
import { BycryptService } from './bycrypt.service';

describe('BycryptService', () => {
  let service: BycryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BycryptService],
    }).compile();

    service = module.get<BycryptService>(BycryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
