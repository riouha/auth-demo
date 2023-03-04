import { InjectRepository } from '@nestjs/typeorm';
import { SmsLog } from '../entities/sms-log.entity';
import { MoreThan, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsLogService {
  constructor(
    @InjectRepository(SmsLog) private readonly smslogRepo: Repository<SmsLog>,
    private readonly configService: ConfigService,
  ) {}
  private smsExpiration = this.configService.get<number>('otp.expiration'); // in ms

  async writeLog(userId: number, code: string) {
    const log = new SmsLog();
    log.userId = userId;
    log.code = code;
    return this.smslogRepo.save(log);
  }

  async validateOtpCode(userId: number, code: string) {
    return this.smslogRepo.findOne({
      where: { userId, code, used: false, date: MoreThan(new Date(Date.now() - this.smsExpiration)) },
    });
  }

  async isCodeAlreadySended(userId: number) {
    const log = await this.smslogRepo.findOne({
      where: { userId, used: false, date: MoreThan(new Date(Date.now() - this.smsExpiration)) },
    });
    if (log) return true;
    return false;
  }
}
