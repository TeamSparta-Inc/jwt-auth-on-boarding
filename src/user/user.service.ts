import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { TokenDto } from '../jwt/jwt.dto';
import { JwtService } from '../jwt/jwt.service';
import { User } from './user.schema';
import { LoginUserDto } from './login-user.dto';
import { InfoUserDto } from './info-user.dto';

@Injectable()
export class UserService {
  public static readonly INVALID_ID_MESSAGE = '아이디가 올바르지 않습니다';
  public static readonly INVALID_PASSWORD_MESSAGE =
    '비밀번호가 올바르지 않습니다';
  public static readonly DUPLICATED_ID_MESSAGE = '이미 존재하는 아이디 입니다.';

  jwtService = new JwtService();

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(registerUserDto: {
    password: string;
    userId: string;
  }): Promise<TokenDto> {
    const user = await this.userModel.findOne({
      userId: registerUserDto.userId,
    });
    if (user) {
      throw new BadRequestException(UserService.DUPLICATED_ID_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    const savedUser = await this.userModel.create({
      userId: registerUserDto.userId,
      password: hashedPassword,
    });

    return this.jwtService.publishToken(savedUser._id);
  }

  async login(loginUserDto: LoginUserDto): Promise<TokenDto> {
    const user = await this.userModel.findOne({ userId: loginUserDto.userId });

    if (!user) {
      throw new NotFoundException(UserService.INVALID_ID_MESSAGE);
    }

    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException(UserService.INVALID_PASSWORD_MESSAGE);
    }

    return this.jwtService.publishToken(user._id);
  }

  async getInfo(id: string): Promise<InfoUserDto> {
    const user = await this.userModel.findById(id);
    return new InfoUserDto(user.userId);
  }
}
