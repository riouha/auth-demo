import {
  IsPositive,
  IsIn,
  IsNumber,
  IsNumberOptions,
  MaxLength,
  MinLength,
  ValidationArguments,
  ValidationOptions,
  IsString,
  Length,
  IsInt,
  IsBoolean,
  Min,
  Max,
  IsPhoneNumber,
  IsNumberString,
  IsJWT,
  IsNotEmpty,
  Matches,
  IsEmail,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { CustomValidation } from '../decorators/custom-validation.decorator';
import { validateNationalCode } from '../utils/national-code';
//============================================================================================

export function stringifyI18nError(key: string, opts?: ValidationOptions) {
  return (args: ValidationArguments) => JSON.stringify({ key, constraints: args.constraints, opts });
}

export const I18n_IsNotEmpty = (opts?: ValidationOptions): PropertyDecorator =>
  IsNotEmpty({ ...opts, message: stringifyI18nError('validation.IsNotEmpty', opts) });

//#region string
export const I18n_IsString = (opts?: ValidationOptions): PropertyDecorator =>
  IsString({ ...opts, message: stringifyI18nError('validation.IsString', opts) });

export const I18n_IsEmail = (options?: any, opts?: ValidationOptions): PropertyDecorator =>
  IsEmail(options, { ...opts, message: stringifyI18nError('validation.IsEmail', opts) });
export const I18n_Matches = (pattern: RegExp, opts?: ValidationOptions): PropertyDecorator =>
  Matches(pattern, { ...opts, message: stringifyI18nError('validation.Matches', opts) });

export const I18n_MinLength = (min: number, opts?: ValidationOptions): PropertyDecorator =>
  MinLength(min, { ...opts, message: stringifyI18nError('validation.MinLength', opts) });
export const I18n_MaxLength = (max: number, opts?: ValidationOptions): PropertyDecorator =>
  MaxLength(max, { ...opts, message: stringifyI18nError('validation.MaxLength', opts) });

export const I18n_Length = (min: number, max: number, opts?: ValidationOptions): PropertyDecorator =>
  Length(min, max, { ...opts, message: stringifyI18nError('validation.Length', opts) });

export const I18n_IsIn = (values: readonly any[], opts?: ValidationOptions): PropertyDecorator =>
  IsIn(values, { ...opts, message: stringifyI18nError('validation.IsIn', opts) });

export const I18n_IsPhoneNumber = (region?: any, opts?: ValidationOptions): PropertyDecorator =>
  IsPhoneNumber(region, { ...opts, message: stringifyI18nError('validation.IsPhoneNumber', opts) });
export const I18n_IsNumberString = (options?: any, opts?: ValidationOptions): PropertyDecorator =>
  IsNumberString(options, { ...opts, message: stringifyI18nError('validation.IsNumberString', opts) });
export const I18n_IsJWT = (opts?: ValidationOptions): PropertyDecorator =>
  IsJWT({ ...opts, message: stringifyI18nError('validation.IsJWT', opts) });

export const I18n_IsNationalCode = () =>
  CustomValidation((obj) => validateNationalCode(obj.nationalCode), {
    message: stringifyI18nError('validation.IsNationalCode'),
  });
//#endregion

//#endregion number
export const I18n_IsNumber = (options?: IsNumberOptions, opts?: ValidationOptions): PropertyDecorator =>
  IsNumber(options, { ...opts, message: stringifyI18nError('validation.IsNumber', opts) });
export const I18n_IsInt = (opts?: ValidationOptions): PropertyDecorator =>
  IsInt({ ...opts, message: stringifyI18nError('validation.IsInt', opts) });
export const I18n_IsPositive = (opts?: ValidationOptions): PropertyDecorator =>
  IsPositive({ ...opts, message: stringifyI18nError('validation.IsPositive', opts) });
export const I18n_Min = (min: number, opts?: ValidationOptions): PropertyDecorator =>
  Min(min, { ...opts, message: stringifyI18nError('validation.Min', opts) });
export const I18n_Max = (max: number, opts?: ValidationOptions): PropertyDecorator =>
  Max(max, { ...opts, message: stringifyI18nError('validation.Max', opts) });

//#endregion

//#endregion boolean
export const I18n_IsBoolean = (opts?: ValidationOptions): PropertyDecorator =>
  IsBoolean({ ...opts, message: stringifyI18nError('validation.IsBoolean', opts) });

//#endregion

//#endregion array
export const I18n_IsArray = (opts?: ValidationOptions): PropertyDecorator =>
  IsArray({ ...opts, message: stringifyI18nError('validation.IsArray', opts) });

export const I18n_ArrayMaxSize = (max: number, opts?: ValidationOptions): PropertyDecorator =>
  ArrayMaxSize(max, { ...opts, message: stringifyI18nError('validation.ArrayMaxSize', opts) });
export const I18n_ArrayMinSize = (max: number, opts?: ValidationOptions): PropertyDecorator =>
  ArrayMinSize(max, { ...opts, message: stringifyI18nError('validation.ArrayMinSize', opts) });

//#endregion
