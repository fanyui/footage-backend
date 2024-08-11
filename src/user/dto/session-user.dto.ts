import { IsEmail, IsString } from 'class-validator';

export class SessionUserDto {
  /**
   * @example "johndoe@gmail.com"
   */
  @IsEmail()
  email: string;
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
  sub: string;
}
