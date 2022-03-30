import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './module/customer/customer.module';
import { PrismaService } from './prisma.service';
import { EmployeeModule } from './module/employee/employee.module';

@Global()
@Module({
  imports: [CustomerModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
