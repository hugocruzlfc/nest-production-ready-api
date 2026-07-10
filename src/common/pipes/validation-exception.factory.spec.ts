// TODO: also cover nested errors via error.children and the empty-errors case.

import { ValidationError } from '@nestjs/common';

import { validationExceptionFactory } from './validation-exception.factory';

describe('validationExceptionFactory', () => {
  it('flattens a flat validation error into {property, message}', () => {
    const errors: ValidationError[] = [
      {
        property: 'name',
        constraints: { minLength: 'name must be longer than 3 characters' },
      },
    ];

    const exception = validationExceptionFactory(errors);

    expect((exception.getResponse() as { message: unknown }).message).toEqual(
      [{ property: 'name', message: 'name must be longer than 3 characters' }],
    );
  });
});
