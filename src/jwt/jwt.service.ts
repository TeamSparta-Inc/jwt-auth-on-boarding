import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TokenDto } from './jwt.dto';

@Injectable()
export class JwtService {
  private readonly secretKey = 'sychaeteamspartaonboarding';
  private readonly accessTokenExpiry = 60 * 30;
  private readonly refreshTokenExpiry = 60 * 60 * 6;

  publishToken(id: string): TokenDto {
    return new TokenDto(
      this.generateAccessToken(id),
      this.generateRefreshToken(id),
    );
  }

  generateAccessToken(id: string): string {
    const payload = {
      sub: id,
      type: 'access',
      exp: Math.floor(Date.now() / 1000) + this.accessTokenExpiry,
    };
    return this.generateToken(payload);
  }

  generateRefreshToken(id: string): string {
    const payload = {
      sub: id,
      type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + this.refreshTokenExpiry,
    };
    return this.generateToken(payload);
  }

  private generateToken(payload: Record<string, any>): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));

    const signature = this.generateSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private generateSignature(header: string, payload: string): string {
    const signatureInput = `${header}.${payload}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(signatureInput);
    return hmac
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
