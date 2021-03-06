import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StrictValidationPipe } from '../../common/strict-validation-pipe';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { SuccessfulAuthResponseDto } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';

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

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    description: 'Authenticate as a dashboard user',
  })
  async logIn(
    @Body(StrictValidationPipe) signInDto: SignInDto,
  ): Promise<SuccessfulAuthResponseDto> {
    const { email, password } = signInDto;
    return await this.employeeService.logIn(email, password);
  }
}
