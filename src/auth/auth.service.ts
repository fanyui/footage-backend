// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { removeObjKeys } from 'src/utils/helpers'
import { CognitoUser } from './entity/auth.entity'
import { User as IUserModel } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRETE,
      });
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException()
    }
    const isMatch = await bcrypt.compare(pass, user.password)
    if (!isMatch) {
      throw new UnauthorizedException()
    }
    const payload: CognitoUser = { sub: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName }
    const IUser = removeObjKeys<IUserModel>(user, ['password'])
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: IUser,
    }
  }
  async signUp(sinupUser: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const createuser: CreateUserDto = {
      ...sinupUser,
      role: 'USER',
      password: await bcrypt.hash(sinupUser.password, salt),
    };

    const user = await this.userService.create(createuser);
    const { password, updatedAt, createdAt, id, role, ...result } = user;

    const payload = { sub: id, ...result };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
