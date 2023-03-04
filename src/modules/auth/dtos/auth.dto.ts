import { UseI18n } from '../../../lib/multi-language/use-i18n.decorator';
import {
  I18n_IsPhoneNumber,
  I18n_IsString,
  I18n_Length,
} from '../../../lib/multi-language/i18n-class-validator.decorator';

@UseI18n('auth')
export class LoginDto {
  @I18n_IsPhoneNumber({ region: 'IR' })
  mobile: string;

  @I18n_IsString()
  password: string;
}

@UseI18n('auth')
export class SendOTPDto {
  @I18n_IsPhoneNumber({ region: 'IR' })
  mobile: string;
}
@UseI18n('auth')
export class VerifyOTPDto {
  @I18n_IsPhoneNumber({ region: 'IR' })
  mobile: string;

  @I18n_IsString()
  @I18n_Length(5, 5)
  code: string;
}
