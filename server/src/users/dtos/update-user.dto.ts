import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(User, ['email', 'password', 'name', 'profileImage']),
) {
  @Field((type) => Int)
  inputId: number;
}

@ObjectType()
export class UpdateUserOutput extends CommonOutput {}
