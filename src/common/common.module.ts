import { Module } from '@nestjs/common';
import { SmsIrService } from './sms/sms-ir.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [SmsIrService],
  exports: [SmsIrService],
})
export class CommonModule {}
