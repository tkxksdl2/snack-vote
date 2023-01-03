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

  @Role(['Any'])
  @Mutation((returns) => CreateAgendaOutput)
  createAgenda(
    @AuthUser() user: User,
    @Args('input') createAgendaInput: CreateAgendaInput,
  ): Promise<CreateAgendaOutput> {
    return this.agendaService.createAgenda(user, createAgendaInput);
  }
}
