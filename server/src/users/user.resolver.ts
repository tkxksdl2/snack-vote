import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { CreateUserInput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => Boolean)
  me() {
    return true;
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Mutation((returns) => CommonOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CommonOutput> {
    return this.userService.createUser(createUserInput);
  }
}
