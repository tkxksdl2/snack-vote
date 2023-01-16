import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { CreateUserInput } from './dtos/create-user.dto';
import { DeleteUserInput, DeleteUserOutput } from './dtos/delete-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { RefreshInput, RefreshOutput } from './dtos/refresh.dto';
import { UpdateUserInput, UpdateUserOutput } from './dtos/update-user.dto';
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

  @Mutation((returns) => RefreshOutput)
  refresh(@Args('input') refreshInput: RefreshInput): Promise<RefreshOutput> {
    return this.userService.refresh(refreshInput);
  }

  @Mutation((returns) => CommonOutput)
  createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CommonOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteUserOutput)
  deleteUser(
    @AuthUser() user: User,
    @Args('input') deleteUserInput: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    return this.userService.deleteUser(user, deleteUserInput);
  }

  @Role(['Any'])
  @Mutation((returns) => UpdateUserOutput)
  updateUser(
    @AuthUser() user: User,
    @Args('input') updateUserInput: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    return this.userService.updateUser(user, updateUserInput);
  }
}
