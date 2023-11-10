import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CommonOutput {
  @Field((type) => String, { nullable: true })
  accessToken?: string;

  @Field((type) => Int, { nullable: true })
  userId?: number;
}

@InputType()
export class GoogleLoginInput {
  @Field((type) => String)
  @IsString()
  token: string;
}

@ObjectType()
export class GoogleLoginOutput extends LoginOutput {
  @Field((type) => String, { nullable: true })
  email?: string;

  @Field((type) => Boolean, { nullable: true })
  createRequired?: boolean;
}
