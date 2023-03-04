import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { SmsLog } from '../auth/entities/sms-log.entity';
import { SmsLogService } from '../auth/services/sms-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
