import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidYouTubeUrl } from './youtube.utils';

@ValidatorConstraint({ name: 'isYouTubeUrl', async: false })
class IsYouTubeUrlConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isValidYouTubeUrl(value);
  }

  defaultMessage(): string {
    return 'videoUrl must be a valid YouTube URL';
  }
}

/**
 * Validates that a string property is a supported YouTube video URL.
 */
export function IsYouTubeUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isYouTubeUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsYouTubeUrlConstraint,
    });
  };
}
