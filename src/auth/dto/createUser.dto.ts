import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  readonly userName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly password: string;

  @IsNotEmpty()
  readonly email: string;
}
