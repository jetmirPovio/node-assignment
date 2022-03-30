import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EmployeeJwtPayload } from '../interface/jwt-payload.interface';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: EmployeeJwtPayload): Promise<EmployeeJwtPayload> {
    const employee = await this.prismaService.employee.findMany({
      where: {
        Email: payload.email,
      },
    });

    if (employee.length === 0) {
      throw new NotFoundException('Employee is not found!');
    }

    const employeePayload: EmployeeJwtPayload = {
      id: employee[0].EmployeeId.toString(),
      id_employee: employee[0].EmployeeId,
      email: employee[0].Email,
    };
    return employeePayload;
  }
}
