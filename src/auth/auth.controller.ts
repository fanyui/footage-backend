import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthResonse } from './entity/auth.entity';
import { SignInDto } from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  signup(@Body() signUpData: CreateUserDto): Promise<AuthResonse> {
    try {
      return this.authService.signUp(signUpData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('login')
  signIn(@Body() signInDto: SignInDto): Promise<AuthResonse> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
