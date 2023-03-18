import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class UserOutputType extends PickType(User, [
  'id',
  'email',
  'password',
  'name',
  'profileImage',
  'role',
]) {}

@ObjectType()
export class FindUserByIdOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  user?: UserOutputType;
}
