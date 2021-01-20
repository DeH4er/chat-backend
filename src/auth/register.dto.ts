import * as Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export const RegisterDtoSchema = Joi.object({
  username: Joi.string().min(5).max(20).required(),
  password: Joi.string().min(5).max(20).required(),
});
