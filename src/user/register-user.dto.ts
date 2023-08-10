import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
  }
}
