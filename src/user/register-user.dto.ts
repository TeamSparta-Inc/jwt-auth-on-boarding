import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'testId',
    description: '사용자 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'testPassword',
    description: '사용자 PW',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  constructor(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
  }
}
