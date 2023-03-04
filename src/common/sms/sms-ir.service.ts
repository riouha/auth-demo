import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { ISmsService } from './sms.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsIrService implements ISmsService {
  constructor(private readonly configService: ConfigService) {}

  private async getSmsToken() {
    return axios.post('http://RestfulSms.com/api/Token', {
      UserApiKey: this.configService.get<string>('otp.smsir.key'),
      SecretKey: this.configService.get<string>('otp.smsir.secret'),
    });
  }

  async send(phone: string, code: string) {
    const getTokenResult = await this.getSmsToken();
    const TokenKey = getTokenResult.data.TokenKey;

    const result = await axios.post(
      'https://restfulsms.com/api/UltraFastSend',
      {
        ParameterArray: [
          {
            Parameter: 'code',
            ParameterValue: code,
          },
          {
            Parameter: 'name',
            ParameterValue: 'code ورود شما',
          },
        ],
        Mobile: phone,
        TemplateId: '5648',
      },
      {
        headers: {
          'x-sms-ir-secure-token': TokenKey,
        },
      },
    );
    if (!result.data.IsSuccessful) throw new InternalServerErrorException('try later');
  }
}
