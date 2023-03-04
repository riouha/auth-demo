import { ValidationError } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';
import { I18nMetadataKey } from './use-i18n.decorator';

export function translateErrors(errors: ValidationError[], i18n: I18nContext): ValidationError[] {
  return errors.map((error) => {
    //1
    const i18nMetadata = Reflect.getMetadata(I18nMetadataKey, error.target);
    let propertyTitle = error.property;
    if (i18nMetadata && i18n.lang !== 'en') {
      const transpath = `${i18nMetadata.propertyTranslatePath}.${error.property}`;
      const translate = i18n.t(transpath);
      if (translate !== transpath) propertyTitle = translate;
    }

    //2
    if (error.constraints) {
      Object.keys(error.constraints).forEach((key) => {
        try {
          const data = JSON.parse(error.constraints[key]);
          if (data.key) {
            error.constraints[key] = i18n.t(data.key, {
              args: { property: propertyTitle, constraints: data.constraints },
            });
            if (data.opts.each) error.constraints[key] = i18n.t('validation.Each') + error.constraints[key];
          }
        } catch {}
      });
    }
    if (error.children?.length) error.children = translateErrors(error.children ?? [], i18n);

    return error;
  });
}

export function validatoionErrorToObjectError(validationError: ValidationError) {
  const recFunc = (verr: ValidationError, obj: any) => {
    if (!verr.children?.length) obj[verr.property] = Object.values(verr.constraints).join('\r\n');
    else {
      for (let i = 0; i < verr.children.length; i++) {
        const result = recFunc(verr.children[i], {});
        obj[verr.property] = { ...obj[verr.property], ...result };
      }
    }
    return obj;
  };

  return recFunc(validationError, {});
}
