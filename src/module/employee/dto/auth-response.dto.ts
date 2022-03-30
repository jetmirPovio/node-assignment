import { ApiProperty } from '@nestjs/swagger';

export class SuccessfulAuthResponseDto {
  @ApiProperty({description: 'JSON Web Token'})
  accessToken!: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}