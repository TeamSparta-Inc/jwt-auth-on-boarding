import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './register-user.dto';
import { ResponseDto } from '../response.dto';
import { TokenDto } from '../jwt/jwt.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/api/v1/users')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ResponseDto<TokenDto>> {
    // setCookie로 바로 token 넣어주기
    const token = this.userService.registerUser(registerUserDto);
    return ResponseDto.createWithoutData(HttpStatus.CREATED, '회원가입 성공');
  }
}
