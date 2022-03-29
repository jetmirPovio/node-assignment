import { Controller, Get, Param, Res } from '@nestjs/common';
import { Track } from '@prisma/client';
import { Response } from 'express';

import { CustomerService } from './customer.service';
import { ApiTags } from '@nestjs/swagger';

/* 
  You don't need to change anything here unless you opted for Level 2.
*/
@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/:id/tracks')
  async getCustomerTracks(@Param('id') customerId: number): Promise<Track[]> {
    return await this.customerService.getCustomerTracks(customerId);
  }

  @Get('/pdf')
  async getCustomersPdf(@Res() res: Response): Promise<any> {
    const pdf = await this.customerService.getCustomersPdf();

    res.attachment('customers.pdf');
    res.send(Buffer.from(pdf));
  }
}
