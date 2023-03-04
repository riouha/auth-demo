export const I18nMetadataKey = 'UseI18n';

export function UseI18n(propertyTranslatePath?: string) {
  return function (target: any) {
    Reflect.defineMetadata(I18nMetadataKey, { propertyTranslatePath }, target.prototype);
  };
}
