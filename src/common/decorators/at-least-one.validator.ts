import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function AtLeastOneOf(property: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'AtLeastOneOf',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(_value: unknown, args: ValidationArguments) {
                    const [relatedProperties] = args.constraints;
                    return relatedProperties.some((prop: string) =>
                        args.object[prop] !== undefined && args.object[prop] !== null
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedProperties] = args.constraints;
                    return `No mínimo um dos campos ${relatedProperties.join(', ')} deve ser informado`;
                },
            },
        });
    };
}