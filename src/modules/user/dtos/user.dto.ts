import { OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UseI18n } from '../../../lib/multi-language/use-i18n.decorator';
import {
  I18n_IsPhoneNumber,
  I18n_IsString,
  I18n_MinLength,
} from '../../../lib/multi-language/i18n-class-validator.decorator';

@UseI18n('user')
export class SignupUserDto {
  @I18n_IsPhoneNumber({ region: 'IR' })
  mobile: string;

  @IsOptional()
  @I18n_IsString()
  @I18n_MinLength(6)
  password?: string;

  @IsOptional()
  @I18n_IsString()
  name?: string;
}

export class EditProfileDto extends PartialType(OmitType(SignupUserDto, ['mobile', 'password'])) {}
