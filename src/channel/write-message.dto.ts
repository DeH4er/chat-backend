import { ApiProperty } from '@nestjs/swagger';

export class WriteMessageDto {
  @ApiProperty()
  message: string;
}
