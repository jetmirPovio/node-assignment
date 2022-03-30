import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export class StrictValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      whitelist: true,
      // forbidNonWhitelisted: true,
    });
  }
}
