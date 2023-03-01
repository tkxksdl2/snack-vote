import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AgendaService } from './agenda.service';
import {
  CreateAgendaInput,
  CreateAgendaOutput,
} from './dtos/create-agenda.dto';
import {
  DeleteAgendaInput,
  DeleteAgendaOutput,
} from './dtos/delete-agenda.dto';
import {
  FindAgendaByIdInput,
  FindAgendaByIdOutput,
} from './dtos/find-agenda-by-id.dto';
import {
  SearchAgendasByCategoryInput,
  SearchAgendasByCategoryOutput,
} from './dtos/search-agendas-by-category';
import {
  GetAllAgendasInput,
  GetAllAgendasOutput,
} from './dtos/get-all-agendas.dto';
import {
  GetMyAgendasInput,
  GetmyAgendasOutput,
} from './dtos/get-my-agendas.dto';
import {
  GetVotedOpinionsInput,
  GetVotedOpinionsOutput,
} from './dtos/get-voted-opinions.dto';
import {
  VoteOrUnvoteInput,
  VoteOrUnvoteOutput,
} from './dtos/vote-or-unvote.dto';
import { Agenda } from './entities/agenda.entity';
import { GetMosteVotedAgendasOutput } from './dtos/get-most-voted-agendas';

@Resolver((of) => Agenda)
export class AgendaResolver {
  constructor(private readonly agendaService: AgendaService) {}

  @Query((returns) => FindAgendaByIdOutput)
  findAgendaById(
    @Args('input') findAgendaByIdInput: FindAgendaByIdInput,
  ): Promise<FindAgendaByIdOutput> {
    return this.agendaService.findAgendaById(findAgendaByIdInput);
  }

  @Query((returns) => GetAllAgendasOutput)
  getAllAgendas(@Args('input') getAllAgendasInput: GetAllAgendasInput) {
    return this.agendaService.getAllAgendas(getAllAgendasInput);
  }

  @Query((returns) => SearchAgendasByCategoryOutput)
  searchAgendasByCategory(
    @Args('input') searchAgendasByCategoryInput: SearchAgendasByCategoryInput,
  ): Promise<SearchAgendasByCategoryOutput> {
    return this.agendaService.searchAgendasByCategory(
      searchAgendasByCategoryInput,
    );
  }

  @Query((returns) => GetMosteVotedAgendasOutput)
  getMostVotedAgendas(): Promise<GetMosteVotedAgendasOutput> {
    return this.agendaService.getMostVotedAgendas();
  }

  @Role(['Any'])
  @Query((returns) => GetmyAgendasOutput)
  getMyAgendas(
    @AuthUser() user: User,
    @Args('input') getMyAgendasInput: GetMyAgendasInput,
  ): Promise<GetmyAgendasOutput> {
    return this.agendaService.getMyAgendas(user, getMyAgendasInput);
  }

  @Role(['Any'])
  @Mutation((returns) => CreateAgendaOutput)
  createAgenda(
    @AuthUser() user: User,
    @Args('input') createAgendaInput: CreateAgendaInput,
  ): Promise<CreateAgendaOutput> {
    return this.agendaService.createAgenda(user, createAgendaInput);
  }

  @Role(['Any'])
  @Mutation((returns) => DeleteAgendaOutput)
  deleteAgenda(
    @AuthUser() user: User,
    @Args('input') deleteAgendaInput: DeleteAgendaInput,
  ): Promise<DeleteAgendaOutput> {
    return this.agendaService.deleteAgenda(user, deleteAgendaInput);
  }

  @Role(['Any'])
  @Mutation((returns) => VoteOrUnvoteOutput)
  voteOrUnvote(
    @AuthUser() user: User,
    @Args('input') voteOrUnvoteInput: VoteOrUnvoteInput,
  ): Promise<VoteOrUnvoteOutput> {
    return this.agendaService.voteOrUnvote(user, voteOrUnvoteInput);
  }

  @Role(['Any'])
  @Query((returns) => GetVotedOpinionsOutput)
  getVotedOpinions(
    @AuthUser() user: User,
    @Args('input') getVotedOpinionsInput: GetVotedOpinionsInput,
  ): Promise<GetVotedOpinionsOutput> {
    return this.agendaService.getVotedOpinions(user, getVotedOpinionsInput);
  }
}
