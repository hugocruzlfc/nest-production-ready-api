// TODO: also cover the default "Success" message and the response's actual statusCode.

import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of } from 'rxjs';

import { TransformInterceptor } from './transform.interceptor';

describe('TransformInterceptor', () => {
  it('wraps the response using the @ResponseMessage value when present', (done) => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue('Challenge created successfully') } as unknown as Reflector;
    const interceptor = new TransformInterceptor(reflector);

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getResponse: () => ({ statusCode: 201 }) }),
    } as unknown as ExecutionContext;

    const callHandler: CallHandler = { handle: () => of({ id: 'challenge-1' }) };

    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(result).toEqual({
        statusCode: 201,
        message: 'Challenge created successfully',
        data: { id: 'challenge-1' },
      });
      done();
    });
  });
});
