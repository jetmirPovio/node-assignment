import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EmployeeJwtPayload } from 'src/module/employee/interface/jwt-payload.interface';

export const GetToken = createParamDecorator(
  (data, ctx: ExecutionContext): EmployeeJwtPayload => {
    const request: Request & {
      token: EmployeeJwtPayload;
    } = ctx.switchToHttp().getRequest();
    return request.token;
  },
);
