import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';

@InputType()
export class RefreshInput {
  @Field((type) => String)
  accessToken: string;

  @Field((type) => Int)
  refreshTokenId: number;
}

@ObjectType()
export class RefreshOutput extends CommonOutput {
  @Field((type) => String, { nullable: true })
  newAccessToken?: string;
}
