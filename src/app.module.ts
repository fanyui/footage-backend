import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import { FootageModule } from './footage/footage.module';
import { GeminiService } from './gemini/gemini.service';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'), // added ../ to get one folder back
      serveRoot: '/public/' //last slash was important
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    AuthModule,
    UserModule,
    FootageModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, PrismaService, UserService, GeminiService],
})
export class AppModule { }
