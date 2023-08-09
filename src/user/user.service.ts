import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './register-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { TokenDto } from '../jwt/jwt.dto';
import { JwtService } from '../jwt/jwt.service';
import { User } from './userModel';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<TokenDto> {
    const id = registerUserDto.id;
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
    await this.userModel.create({
      id,
      password: hashedPassword,
    });

    const jwtService = new JwtService();
    const token = jwtService.publishToken(id);

    console.log(token);
    return token;
  }
}
