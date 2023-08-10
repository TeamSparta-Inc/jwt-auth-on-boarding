import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './jwt.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async create(refreshToken: Partial<RefreshToken>): Promise<RefreshToken> {
    return this.refreshTokenModel.create(refreshToken);
  }

  async findOneByUserId(userId: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ userId }).exec();
  }

  async updateRefreshToken(data: Partial<RefreshToken>): Promise<RefreshToken> {
    const refreshToken = data.refreshToken;
    const userId = data.userId;

    return this.refreshTokenModel
      .findOneAndUpdate(
        { userId },
        {
          refreshToken: refreshToken,
        },
        { new: true }, // Return the updated document
      )
      .exec();
  }
}
