import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '../jwt/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { RefreshToken, RefreshTokenSchema } from '../jwt/jwt.schema';
import { UserRepository } from './user.repository';
import { RefreshTokenRepository } from '../jwt/jwt.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, UserRepository, RefreshTokenRepository],
})
export class UserModule {}
