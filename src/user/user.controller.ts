import {
  Body,
  Controller,
  Get,
  Headers,
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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('UserController')
@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: ResponseDto<TokenDto>,
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true })
    response: Response,
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
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: ResponseDto<TokenDto>,
  })
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

  @Post('/refresh')
  @ApiResponse({
    status: 201,
    description: '토큰 갱신 성공',
    type: ResponseDto<TokenDto>,
  })
  async refreshToken(
    @Headers('x-sparta-refresh-token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseDto<TokenDto>> {
    const tokens = await this.userService.refresh(refreshToken);

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
    });
    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
    });
    return ResponseDto.createWithoutData(HttpStatus.CREATED, '토큰 갱신 성공');
  }

  @Get('/me')
  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: ResponseDto<InfoUserDto>,
  })
  @ApiBearerAuth()
  async getInfo(@Req() request): Promise<ResponseDto<InfoUserDto>> {
    return new ResponseDto<InfoUserDto>(
      HttpStatus.OK,
      '사용자 정보 조회 성공',
      await this.userService.getInfo(request.user.sub),
    );
  }
}
