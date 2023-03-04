import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, ConflictException } from '@nestjs/common';
import { getI18nContextFromArgumentsHost } from 'nestjs-i18n';
//===========================================================

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter<ConflictException> {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const i18n = getI18nContextFromArgumentsHost(host);

    const errorObject = exception.getResponse();
    let exceptionMessage = exception.message;
    if (typeof errorObject !== 'string') {
      const { key, property, propertyTranslatePath } = errorObject as any;
      let propertyTitle = property;
      if (propertyTranslatePath && i18n.lang !== 'en') {
        const transpath = `${propertyTranslatePath}.${property}`;
        const translate = i18n.t(transpath);
        if (translate !== transpath) propertyTitle = translate;
      }
      exceptionMessage = i18n.t(`errors.409.${key}`, { args: { property: propertyTitle } });
    }

    const response = host.switchToHttp().getResponse();
    response.status(HttpStatus.CONFLICT).send({
      statusCode: exception.getStatus(),
      message: exception.name,
      error: exceptionMessage,
    });
  }
}
