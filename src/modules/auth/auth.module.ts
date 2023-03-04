import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../../common/common.module';
import { ConfigModule } from '@nestjs/config';
import AccessTokenGuard from './guards/access-token.guard';
import RefreshTokenGuard from './guards/refresh-token.guard';
import { AccessTokenStrategy } from './guards/access-token.strategy';
import { RefreshTokeStrategy } from './guards/refresh-token.strategy';
import { SmsLogService } from './services/sms-log.service';
import { SmsLog } from './entities/sms-log.entity';
import { LoginLogService } from './services/login-log.service';
import { LoginLog } from './entities/login-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsLog, LoginLog]),
    JwtModule.register({}),
    ConfigModule,
    CommonModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenGuard,
    RefreshTokenGuard,
    AccessTokenStrategy,
    RefreshTokeStrategy,
    SmsLogService,
    LoginLogService,
  ],
  exports: [AccessTokenGuard, RefreshTokenGuard],
})
export class AuthModule {}
