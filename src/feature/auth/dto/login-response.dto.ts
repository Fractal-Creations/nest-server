import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseWebDto {
  @ApiProperty({ example: 'Logged in successfully', description: 'Сообщение об успешной авторизации' })
  message: string;
}

export class LoginResponseMobileDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Access токен' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh токен' })
  refreshToken: string;
}