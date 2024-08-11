import { IsString, IsEmail, Length } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  /**
   * @example "johndoe@gmail.com"
   */
  @IsEmail()
  email: string;
  /**
   * @example w#4sT03@
   */
  @IsString()
  @Length(6, 10)
  password: string;
  /**
   * @example "John"
   */
  @IsString()
  firstName: string;
  /**
   * @example Doe
   */
  @IsString()
  lastName: string;
  /**
   * @example "USER"
   */
  @IsString()
  role: Role;
}
