import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InfoUserDto {
  @ApiProperty({
    example: 'testId',
    description: '사용자 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
