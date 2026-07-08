import { BadRequestException, ValidationError } from '@nestjs/common';

export interface ValidationErrorItem {
  property: string;
  message: string;
}

function flattenErrors(errors: ValidationError[]): ValidationErrorItem[] {
  return errors.flatMap((error) => {
    if (error.constraints) {
      return Object.values(error.constraints).map((message) => ({
        property: error.property,
        message,
      }));
    }

    return error.children ? flattenErrors(error.children) : [];
  });
}

export function validationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  return new BadRequestException(flattenErrors(errors));
}
