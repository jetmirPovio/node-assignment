import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../prisma.service';
import {
  MockContext,
  Context,
  createMockContext,
} from '../../../test/mocks/prisma.mock';
import { EmployeeService } from './employee.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeService],
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
          }),
          inject: [ConfigService],
        }),
      ],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return ctx.prisma;
        }
      })
      .compile();

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
