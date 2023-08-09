import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './register-user.dto';
import { ResponseDto } from '../response.dto';
import { TokenDto } from '../jwt/jwt.dto';
import { Response } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/api/v1/users')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto<TokenDto>> {
    const tokens = await this.userService.registerUser(registerUserDto);

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
    });

    return ResponseDto.createWithoutData(HttpStatus.CREATED, '회원가입 성공');
  }
}
