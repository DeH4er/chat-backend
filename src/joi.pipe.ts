import { ObjectSchema } from '@hapi/joi';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class JoiPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    if (_metadata.type !== 'body') {
      return value;
    }

    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.annotate());
    }

    return value;
  }
}
