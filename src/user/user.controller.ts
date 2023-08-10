import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './register-user.dto';
import { ResponseDto } from '../response.dto';
import { TokenDto } from '../jwt/jwt.dto';
import { Response } from 'express';
import { LoginUserDto } from './login-user.dto';
import { JwtGuard } from '../jwt/jwt.guard';
import { InfoUserDto } from './info-user.dto';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto<TokenDto>> {
    const tokens = await this.userService.register(registerUserDto);

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
    });

    return ResponseDto.createWithoutData(HttpStatus.CREATED, '회원가입 성공');
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto<TokenDto>> {
    const tokens = await this.userService.login(loginUserDto);

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
    });

    return ResponseDto.createWithoutData(HttpStatus.OK, '로그인 성공');
  }

  @Get('/me')
  @UseGuards(JwtGuard)
  async getInfo(@Req() request): Promise<ResponseDto<InfoUserDto>> {
    return new ResponseDto<InfoUserDto>(
      HttpStatus.OK,
      '사용자 정보 조회 성공',
      await this.userService.getInfo(request.user.sub),
    );
  }
}
