import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokeStrategy extends PassportStrategy(Strategy, 'refresh-token-strategy') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.refreshTokenSecret'),
      // passReqToCallback: true,
    });
  }

  validate(payload: any) {
    // const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();
    // if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    return payload;
  }
}
