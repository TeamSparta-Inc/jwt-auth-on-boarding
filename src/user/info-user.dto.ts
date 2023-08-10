import { IsNotEmpty, IsString } from 'class-validator';

export class InfoUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
