import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '../jwt/jwt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserModel } from './userModel';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
