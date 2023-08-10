import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  async findOneByUserId(userId: string): Promise<User | null> {
    return this.userModel.findOne({ userId }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
}
