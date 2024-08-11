import { Test, TestingModule } from '@nestjs/testing';
import { FootageService } from './footage.service';

describe('FootageService', () => {
  let service: FootageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FootageService],
    }).compile();

    service = module.get<FootageService>(FootageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
