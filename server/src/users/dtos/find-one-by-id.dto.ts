import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class FindUserByIdOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
