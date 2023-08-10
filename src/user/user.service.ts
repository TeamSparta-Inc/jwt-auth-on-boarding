import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenDto } from '../jwt/jwt.dto';
import { JwtService } from '../jwt/jwt.service';
import { LoginUserDto } from './login-user.dto';
import { InfoUserDto } from './info-user.dto';
import { UserRepository } from './user.repository';
import { RefreshTokenRepository } from '../jwt/jwt.repository';

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
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(registerUserDto: {
    password: string;
    userId: string;
  }): Promise<TokenDto> {
    const user = await this.userRepository.findOneByUserId(
      registerUserDto.userId,
    );
    if (user) {
      throw new BadRequestException(UserService.DUPLICATED_ID_MESSAGE);
    }

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    const savedUser = await this.userRepository.create({
      userId: registerUserDto.userId,
      password: hashedPassword,
    });

    const tokens = this.jwtService.publishToken(savedUser._id);
    await this.refreshTokenRepository.create({
      refreshToken: tokens.refreshToken,
      userId: savedUser._id,
    });

    return tokens;
  }

  async login(loginUserDto: LoginUserDto): Promise<TokenDto> {
    const user = await this.userRepository.findOneByUserId(loginUserDto.userId);

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
    const existsToken = await this.refreshTokenRepository.findOneByUserId(
      userId,
    );

    if (!existsToken || existsToken.refreshToken !== refreshToken) {
      throw new UnauthorizedException(
        UserService.INVALID_REFRESH_TOKEN_MESSAGE,
      );
    }
    const tokens = this.jwtService.publishToken(userId);

    await this.refreshTokenRepository.updateRefreshToken({
      userId: userId,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async getInfo(id: string): Promise<InfoUserDto> {
    const user = await this.userRepository.findById(id);
    return new InfoUserDto(user.userId);
  }
}
