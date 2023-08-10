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
import { RefreshToken } from '../jwt/jwt.schema';

@Injectable()
export class UserService {
  private static readonly INVALID_ID_MESSAGE = '아이디가 올바르지 않습니다';
  private static readonly INVALID_PASSWORD_MESSAGE =
    '비밀번호가 올바르지 않습니다';
  private static readonly DUPLICATED_ID_MESSAGE =
    '이미 존재하는 아이디 입니다.';
  private static readonly INVALID_REFRESH_TOKEN_MESSAGE =
    '올바르지 않은 토큰입니다.';
  jwtService = new JwtService();

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

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

    const tokens = this.jwtService.publishToken(savedUser._id);
    await this.refreshTokenModel.create({
      refreshToken: tokens.refreshToken,
      userId: savedUser._id,
      createdAt: Date.now(),
    });

    return tokens;
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

  async refresh(refreshToken: string): Promise<TokenDto> {
    const userId = this.jwtService.verifyToken(refreshToken);
    const existsToken = await this.refreshTokenModel.findOne({
      userId: userId,
    });

    if (!existsToken || existsToken.refreshToken !== refreshToken) {
      throw new UnauthorizedException(
        UserService.INVALID_REFRESH_TOKEN_MESSAGE,
      );
    }
    const tokens = this.jwtService.publishToken(userId);

    await this.refreshTokenModel.updateOne({
      userId: userId,
      refreshToken: tokens.refreshToken,
      createdAt: Date.now(),
    });

    return tokens;
  }

  async getInfo(id: string): Promise<InfoUserDto> {
    const user = await this.userModel.findById(id);
    return new InfoUserDto(user.userId);
  }
}
