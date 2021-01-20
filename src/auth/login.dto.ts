import * as Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export const LoginDtoSchema = Joi.object({
  username: Joi.string().min(5).max(20).required(),
  password: Joi.string().min(5).max(20).required(),
});
