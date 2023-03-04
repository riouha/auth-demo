import { Injectable, UnauthorizedException, BadRequestException, UseGuards } from '@nestjs/common';
import { verify } from 'argon2';
import { UserService } from '../../user/services/user.service';
import { SignupUserDto } from '../../user/dtos/user.dto';
import { SmsIrService } from '../../../common/sms/sms-ir.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IRefreshTokenPayload, ITokenPayload } from '../types/token.interface';
import { User } from '../../user/entities/user.entity';
import { generateRandomCode } from '../../../lib/utils/generate-random-code';
import { SmsLogService } from './sms-log.service';
import { VerifyOTPDto, SendOTPDto, LoginDto } from '../dtos/auth.dto';
import { DataSource } from 'typeorm';
import { LoginLogService } from './login-log.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly smsService: SmsIrService,
    private readonly smsLogService: SmsLogService,
    private readonly loginLogService: LoginLogService,
  ) {}

  async signup(dto: SignupUserDto) {
    return this.userService.createUser(dto);
  }

  async login(dto: LoginDto) {
    // find user
    const user = await this.userService.getUserByMobile(dto.mobile);
    if (!user.password) throw new UnauthorizedException('incorrect mobile or password');

    // check for login trys
    await this.loginLogService.canTryLogin(user.id);

    // check password => log failed attempt (wrong password)
    const isValid = await verify(user.password, dto.password);
    if (!isValid) {
      await this.loginLogService.writeLog(user.id, false, false);
      throw new UnauthorizedException('incorrect mobile or password');
    }

    // generate tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken({
        sub: user.id,
        mobile: user.mobile,
        verified: user.isVerified,
        active: user.isActive,
      }),
      this.getRefreshToken({ sub: user.id }),
    ]);

    // log success login
    await this.loginLogService.writeLog(user.id, true, false);

    return { accessToken, refreshToken, user };
  }

  async sendOTP(dto: SendOTPDto) {
    // find user
    const user = await this.userService.getUserByMobile(dto.mobile);
    // generate code, log it and send sms
    await this.generateAndSendOtpCode(user);
    return { message: 'code sended' };
  }

  async verifyOTP(dto: VerifyOTPDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    //##########################################
    try {
      // find user
      const user = await this.userService.getUserByMobile(dto.mobile);

      // check for login trys
      await this.loginLogService.canTryLogin(user.id);

      // validate code => log failed login attempt
      const smsLog = await this.smsLogService.validateOtpCode(user.id, dto.code);
      if (!smsLog) {
        await this.loginLogService.writeLog(user.id, false, true);
        throw new BadRequestException('invalid otp code');
      }

      // verify user
      await this.userService.verifyUser(user, true);

      // generate tokens
      const [accessToken, refreshToken] = await Promise.all([
        this.getAccessToken({
          sub: user.id,
          mobile: user.mobile,
          verified: user.isVerified,
          active: user.isActive,
        }),
        this.getRefreshToken({ sub: user.id }),
      ]);

      // log success login and used code
      await this.loginLogService.writeLog(user.id, true, true);
      smsLog.used = true;
      queryRunner.manager.save(smsLog);

      await queryRunner.commitTransaction();
      return { accessToken, refreshToken, user };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async refreshToken(id: number) {
    const user = await this.userService.getUserById(id);
    // @TODO some condition on user
    return this.getAccessToken({
      sub: user.id,
      mobile: user.mobile,
      active: user.isActive,
      verified: user.isVerified,
    });
  }

  //#region  private routes
  private async getAccessToken(payload: ITokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('auth.accessTokenSecret'),
      expiresIn: this.configService.get<string>('auth.accessTokenExpiration'),
    });
  }

  private async getRefreshToken(payload: IRefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('auth.refreshTokenSecret'),
      expiresIn: this.configService.get<string>('auth.refreshTokenExpiration'),
    });
  }

  private async generateAndSendOtpCode(user: User) {
    const alreadySended = await this.smsLogService.isCodeAlreadySended(user.id);
    if (alreadySended) throw new BadRequestException('please enter last code');

    const code = generateRandomCode();
    await this.smsLogService.writeLog(user.id, code);
    await this.smsService.send(user.mobile, code);
  }
  //#endregion
}
