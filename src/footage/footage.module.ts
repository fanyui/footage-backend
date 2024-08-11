import { Module } from '@nestjs/common';
import { FootageService } from './footage.service';
import { FootageController } from './footage.controller';
import { GeminiService } from 'src/gemini/gemini.service';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  controllers: [FootageController],
  providers: [FootageService, GeminiService, PrismaService],
})
export class FootageModule { }
