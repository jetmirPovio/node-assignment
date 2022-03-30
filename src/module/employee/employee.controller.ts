import { Controller, Post, Body } from '@nestjs/common';
import { Track } from '@prisma/client';

import { EmployeeService } from './employee.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StrictValidationPipe } from 'src/common/strict-validation-pipe';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { SuccessfulAuthResponseDto } from './dto/auth-response.dto';

/* 
  You don't need to change anything here unless you opted for Level 2.
*/
@ApiTags('Employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({ summary: 'Create a new employee' })
  @Post('/signup')
  async signUp(
    @Body(StrictValidationPipe) dto: CreateEmployeeDto,
  ): Promise<SuccessfulAuthResponseDto> {
    return await this.employeeService.signUp(dto);
  }
}
