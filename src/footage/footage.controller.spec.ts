import { Test, TestingModule } from '@nestjs/testing';
import { FootageController } from './footage.controller';
import { FootageService } from './footage.service';

describe('FootageController', () => {
  let controller: FootageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootageController],
      providers: [FootageService],
    }).compile();

    controller = module.get<FootageController>(FootageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
