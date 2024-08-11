import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRE_AFTER },
    }),
  ],
  providers: [AuthService, PrismaService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
