import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaRepository } from './agenda.repository';
import { AgendaResolver } from './agenda.resolver';
import { AgendaService } from './agenda.service';
import { Agenda } from './entities/agenda.entity';
import { Opinion } from './entities/opinion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agenda, Opinion])],
  providers: [AgendaService, AgendaResolver, AgendaRepository],
  exports: [AgendaService],
})
export class AgendaModule {}
