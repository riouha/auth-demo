import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
import { translateErrors, validatoionErrorToObjectError } from './utils';
//===========================================================

export class InputValidationException extends BadRequestException {
  constructor(public errors: ValidationError[]) {
    super();
  }
}

export const InputValidationExceptionFactory = (validationErrors: ValidationError[]) => {
  return new InputValidationException(validationErrors);
};

@Catch(InputValidationException)
export class InputValidationExceptionFilter implements ExceptionFilter<InputValidationException> {
  catch(exception: InputValidationException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);
    const validationErrors = translateErrors(exception.errors ?? [], i18n);

    const nestedError: any = {};
    for (const validationError of validationErrors) {
      Object.assign(nestedError, validatoionErrorToObjectError(validationError));
    }

    const response = host.switchToHttp().getResponse();
    response.status(exception.getStatus()).send({
      statusCode: exception.getStatus(),
      message: exception.name,
      errors: nestedError,
    });
  }
}
