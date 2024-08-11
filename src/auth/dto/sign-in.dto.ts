import { IsString, IsEmail } from 'class-validator';

export class SignInDto {
  /**
   * @example johndoe@gmail.com
   */
  @IsEmail()
  email: string;
  /**
   * @example w#4sT03@
   */
  @IsString()
  password: string;
}
