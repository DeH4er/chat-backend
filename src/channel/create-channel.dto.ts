import * as Joi from '@hapi/joi';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty()
  name: string;
}

export const CreateChannelDtoSchema = Joi.object({
  name: Joi.string().min(4).max(20).required(),
});
