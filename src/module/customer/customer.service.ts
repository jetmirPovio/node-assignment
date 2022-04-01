import { Injectable } from '@nestjs/common';
import { Customer, Track } from '@prisma/client';
import * as fs from 'fs';
const { Worker } = require('worker_threads');

import { PrismaService } from '../../prisma.service';

/* 
  You don't need to change anything here unless you opted for Level 2.
*/

@Injectable()
export class CustomerService {
  robotoFont: Buffer;
  customerList: Customer[];

  constructor(private readonly prismaService: PrismaService) {
    this.robotoFont = fs.readFileSync(`${process.cwd()}/Roboto-Regular.ttf`);
    // Loading customers from a JSON file instead from the database is by design.
    this.customerList = JSON.parse(
      fs.readFileSync(`${process.cwd()}/customers.json`, {
        encoding: 'utf-8',
      }),
    );
  }

  async getCustomerTracks(customerId: number): Promise<Track[]> {
    const result = await this.prismaService.invoiceLine.findMany({
      where: {
        Invoice: {
          Customer: {
            CustomerId: customerId,
          },
        },
      },
      select: {
        Track: true,
      },
    });
    if (!result.length) {
      return [];
    }
    return result.map((t) => t.Track);
  }

  async getAllTracks(): Promise<Track[]> {
    const result = await this.prismaService.track.findMany();
    if (!result.length) {
      return [];
    }
    return result;
  }

  async getCustomersPdf(): Promise<string> {
    return await new Promise((resolve, reject) => {
      const worker = new Worker('./src/module/customer/worker.js');
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }
}
