import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Track } from '@prisma/client';

import { PrismaService } from '../../prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { SuccessfulAuthResponseDto } from './dto/auth-response.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployeeJwtPayload } from './interface/jwt-payload.interface';
import * as bcrypt from 'bcryptjs';

/* 
  You don't need to change anything here unless you opted for Level 2.
*/

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getCustomerTracks(customerId: number): Promise<Track[]> {
    const result = await this.prismaService.customer.findMany({
      where: {
        CustomerId: customerId,
      },
      select: {
        Invoice: {
          select: {
            InvoiceLine: {
              select: {
                Track: true,
              },
            },
          },
        },
      },
    });
    if (!result.length) {
      return [];
    }
    return result[0].Invoice.map((i) => i.InvoiceLine)
      .flat()
      .map((t) => t.Track);
  }

  async signUp(dto: CreateEmployeeDto): Promise<SuccessfulAuthResponseDto> {
    const passwordError = await this.checkPassword(dto.password);
    if (!passwordError) {
      throw new BadRequestException(
        'Your password must be at least 6 characters and contain at least one lower case, upper case, digit and special character',
      );
    }
    const password = await this.hashPassword(dto.password);

    const employee = await this.prismaService.employee.findMany({
      where: {
        Email: dto.email,
      },
    });

    if (employee.length !== 0) {
      throw new BadRequestException('User with that email already exists');
    }

    const user = await this.prismaService.employee.create({
      data: {
        Email: dto.email,
        FirstName: dto.firstName,
        LastName: dto.lastName,
        Pass: password,
      },
    });
    const payload: EmployeeJwtPayload = {
      id: user.EmployeeId.toString(),
      id_employee: user.EmployeeId,
      email: user.Email,
    };
    const accessToken = await this.jwtService.sign(payload, {
      subject: user.EmployeeId.toString(),
      expiresIn: 604800,
    });
    return {
      accessToken,
    };
  }

  async logIn(
    email: string,
    password: string,
  ): Promise<SuccessfulAuthResponseDto> {
    const passwordError = await this.checkPassword(password);
    if (!passwordError) {
      throw new BadRequestException(
        'Your password must be at least 6 characters and contain at least one lower case, upper case, digit and special character',
      );
    }
    const employee = await this.prismaService.employee.findMany({
      where: {
        Email: email,
      },
    });

    if (employee.length === 0) {
      throw new UnauthorizedException('Invalid username and/or password');
    }

    if (!(await this.validatePassword(employee[0].Pass, password))) {
      throw new UnauthorizedException('Invalid username and/or password');
    }

    const payload: EmployeeJwtPayload = {
      id: employee[0].EmployeeId.toString(),
      id_employee: employee[0].EmployeeId,
      email: employee[0].Email,
    };

    const accessToken = await this.jwtService.sign(payload, {
      subject: employee[0].EmployeeId.toString(),
      expiresIn: 604800,
    });

    return {
      accessToken,
    };
  }
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async checkPassword(str) {
    const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return re.test(str);
  }

  async validatePassword(
    hash: string | null,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
