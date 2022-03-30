import { Test, TestingModule } from '@nestjs/testing';
import { getMockRes } from '@jest-mock/express';

import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let customerController: EmployeeController;
  const accessToken = {
    accessToken: 'token',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
    })
      .useMocker((token) => {
        if (token === EmployeeService) {
          return {
            signUp: jest.fn().mockResolvedValue(accessToken),
            logIn: jest.fn().mockResolvedValue(accessToken),
          };
        }
      })
      .compile();

    customerController = app.get<EmployeeController>(EmployeeController);
  });
  it('should return signup token', async () => {
    expect(
      await customerController.signUp({
        firstName: 'name',
        lastName: 'lastName',
        email: 'test@gmail.com',
        password: 'Test@123',
      }),
    ).toBe(accessToken);
  });

  it('should return login token', async () => {
    expect(
      await customerController.logIn({
        email: 'test@gmail.com',
        password: 'Test@123',
      }),
    ).toBe(accessToken);
  });
});
