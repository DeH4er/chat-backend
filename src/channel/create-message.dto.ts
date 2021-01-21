import * as Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  message: string;
}

export const CreateMessageDtoSchema = Joi.object({
  message: Joi.string().min(1).required(),
});
