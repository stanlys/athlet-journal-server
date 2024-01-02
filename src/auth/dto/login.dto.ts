import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
