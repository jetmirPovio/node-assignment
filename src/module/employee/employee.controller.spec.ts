import { Test, TestingModule } from '@nestjs/testing';
import { getMockRes } from '@jest-mock/express';

import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

describe('EmployeeController', () => {
  let customerController: EmployeeController;
  const tracks = [
    {
      TrackId: 1,
      Name: 'name',
      AlbumId: null,
      MediaTypeId: 1,
      GenreId: null,
      Composer: null,
      Milliseconds: 1,
      Bytes: null,
      UnitPrice: 1.1,
    },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
    })
      .useMocker((token) => {
        if (token === EmployeeService) {
          return {
            getCustomerTracks: jest.fn().mockResolvedValue(tracks),
            getCustomersPdf: jest.fn().mockResolvedValue(new Uint8Array()),
          };
        }
      })
      .compile();

    customerController = app.get<EmployeeController>(EmployeeController);
  });
});
