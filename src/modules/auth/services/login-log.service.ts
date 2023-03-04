import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginLog } from '../entities/login-log.entity';

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(LoginLog) private readonly loginlogRepo: Repository<LoginLog>,
    private readonly configService: ConfigService,
  ) {}
  private retrys = this.configService.get<number>('security.failedLogin.retrys');
  private banTime = this.configService.get<number>('security.failedLogin.banTime'); // in ms

  async writeLog(userId: number, success?: boolean, passwordless?: boolean) {
    const log = new LoginLog();
    log.userId = userId;
    log.success = success;
    log.passwordless = passwordless;
    return this.loginlogRepo.save(log);
  }

  async canTryLogin(userId: number) {
    const failedLogins = await this.loginlogRepo.count({
      where: { userId, success: false, date: MoreThan(new Date(Date.now() - this.banTime)) },
    });
    if (failedLogins >= this.retrys)
      throw new BadRequestException(`try ${Math.floor(this.banTime / (60 * 60000))} hour later`);
  }
}
