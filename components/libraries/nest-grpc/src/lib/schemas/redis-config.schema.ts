import { Optional } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom validator to check if each URL is a valid Redis URL
@ValidatorConstraint({ name: 'isValidRedisUrl', async: false })
class IsValidRedisUrlConstraint implements ValidatorConstraintInterface {
  validate(url: string, args: ValidationArguments) {
    if (!url || url == '') {
      return false;
    }
    const redisUrlPattern = /^(\w+|\w+:\d+)(,\w+|\w+:\d+)*$/;
    const nodes = url.split(',');
    for (const node of nodes) {
      if (!redisUrlPattern.test(node)) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    if (!args.value || args.value == '') {
      return 'REDIS_URL is required.';
    }
    return 'Each node in REDIS_URL must be a valid Redis URL. Example: "localhost:6379" or "localhost" or "node1:6379,node2,node3"';
  }
}

export class RedisConfigSchema {
  @Validate(IsValidRedisUrlConstraint)
  REDIS_URL?: string;

  @Optional()
  @IsString({ message: "REDIS_USERNAME is not required. But can't set empty string" })
  @IsNotEmpty({ message: "REDIS_USERNAME is not required. But can't set empty string" })
  REDIS_USERNAME?: string;

  @Optional()
  @IsString({ message: "REDIS_PASSWORD is not required. But can't set empty string" })
  @IsNotEmpty({ message: "REDIS_PASSWORD is not required. But can't set empty string" })
  REDIS_PASSWORD?: string;
}
