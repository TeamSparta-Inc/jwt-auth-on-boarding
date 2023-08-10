import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0ZDUwMjNlMzdjZDYwZmQ3OTUzN2EiLCJ0eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTY5MTM2Mn0.MonQKbV1K2pJmvQBRH_0OqAl3vgiNhzlTn_4-qidJ_c',
    description: 'accessToken',
    required: true,
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NGQ0ZDUwMjNlMzdjZDYwZmQ3OTUzN2EiLCJ0eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTY5MTM2Mn0.MonQKbV1K2pJmvQBRH_0OqAl3vgiNhzlTn_4-qidJ_c',
    description: 'refreshToken',
    required: true,
  })
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
