import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function CustomValidation(
  property: (...args) => Promise<boolean> | boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CustomValidation',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const cb = args.constraints[0];
          return cb(args.object);
        },
      },
    });
  };
}
