import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { User } from 'src/users/entities/user.entity';
import { AgendaService } from './agenda.service';
import {
  CreateAgendaInput,
  CreateAgendaOutput,
} from './dtos/create-agenda.dto';
import {
  FindAgendaByIdInput,
  FindAgendaByIdOutput,
} from './dtos/find-agenda-by-id.dto';
import {
  GetAllAgendasInput,
  GetAllAgendasOutput,
} from './dtos/get-all-agendas.dto';
import {
  GetMyAgendasInput,
  GetmyAgendasOutput,
} from './dtos/get-my-agendas.dto';
import {
  GetVotedAgendasInput,
  GetVotedAgendasOutput,
} from './dtos/get-voted-agendas.dto';
import {
  VoteOrUnvoteInput,
  VoteOrUnvoteOutput,
} from './dtos/vote-or-unvote.dto';
import { Agenda } from './entities/agenda.entity';

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
  @Mutation((returns) => VoteOrUnvoteOutput)
  voteOrUnvote(
    @AuthUser() user: User,
    @Args('input') voteOrUnvoteInput: VoteOrUnvoteInput,
  ): Promise<VoteOrUnvoteOutput> {
    return this.agendaService.voteOrUnvote(user, voteOrUnvoteInput);
  }

  @Role(['Any'])
  @Query((returns) => GetVotedAgendasOutput)
  getVotedAgendas(
    @AuthUser() user: User,
    @Args('input') getVotedAgendasInput: GetVotedAgendasInput,
  ): Promise<GetVotedAgendasOutput> {
    return this.agendaService.getVotedAgendas(user, getVotedAgendasInput);
  }
}
