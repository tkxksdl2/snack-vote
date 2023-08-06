import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetAllAgendasInput } from 'src/agenda/dtos/get-all-agendas.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  AddIssueContentInput,
  AddIssueContentOutput,
} from './dtos/add-issue-content.dto';
import { CreateIssueInput, CreateIssueOutput } from './dtos/create-issue.dto';
import {
  DeleteIssueContentInput,
  DeleteIssueContentOutput,
} from './dtos/delete-issue-content.dto';
import { DeleteIssueInput, DeleteIssueOutput } from './dtos/delete-issue.dto';
import {
  GetAllIssuesInput,
  GetAllIssuesOutput,
} from './dtos/get-all-issues.dto';
import {
  GetIssueAndContentsByIdInput,
  GetIssueAndContentsByIdOutput,
} from './dtos/get-issue-and-contents-by-id.dto';
import {
  UpdateIssueContentInput,
  UpdateIssueContentOutput,
} from './dtos/update-issue-content.dto';
import { Issue } from './entities/issue.entity';
import { IssueService } from './issue.service';

@Resolver((of) => Issue)
export class IssueResolver {
  constructor(private readonly issueService: IssueService) {}

  @Query((returns) => GetAllIssuesOutput)
  getAllIssues(
    @Args('input') getAllIssuesInput: GetAllIssuesInput,
  ): Promise<GetAllIssuesOutput> {
    return this.issueService.getAllIssues(getAllIssuesInput);
  }

  @Role(['Visitor', 'Any'])
  @Query((returns) => GetIssueAndContentsByIdOutput)
  getIssueAndContentsById(
    @AuthUser() user: User,
    @Args('input') getIssueAndContentsByIdInput: GetIssueAndContentsByIdInput,
  ): Promise<GetIssueAndContentsByIdOutput> {
    return this.issueService.getIssueAndContentsById(
      user,
      getIssueAndContentsByIdInput,
    );
  }

  @Role(['Any'])
  @Mutation((returns) => CreateIssueOutput)
  createIssue(
    @AuthUser() author: User,
    @Args('input') createIssueInput: CreateIssueInput,
  ): Promise<CreateIssueOutput> {
    return this.issueService.createIssue(author, createIssueInput);
  }

  @Role(['Any'])
  @Mutation((returns) => AddIssueContentOutput)
  addIssueContent(
    @AuthUser() author: User,
    @Args('input') addIssueContentInput: AddIssueContentInput,
  ): Promise<AddIssueContentOutput> {
    return this.issueService.addIssueContent(author, addIssueContentInput);
  }

  @Role(['Any'])
  @Mutation((returns) => UpdateIssueContentOutput)
  updateIssueContent(
    @AuthUser() author: User,
    @Args('input') updateIssueContentInput: UpdateIssueContentInput,
  ): Promise<UpdateIssueContentOutput> {
    return this.issueService.updateIssueContent(
      author,
      updateIssueContentInput,
    );
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteIssueOutput)
  deleteIssue(
    @AuthUser() user: User,
    @Args('input') deleteIssueInput: DeleteIssueInput,
  ): Promise<DeleteIssueOutput> {
    return this.issueService.deleteIssue(user, deleteIssueInput);
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteIssueContentOutput)
  deleteIssueContent(
    @AuthUser() user: User,
    @Args('input') deleteIssueContentIntput: DeleteIssueContentInput,
  ): Promise<DeleteIssueContentOutput> {
    return this.issueService.deleteIssueContent(user, deleteIssueContentIntput);
  }
}
