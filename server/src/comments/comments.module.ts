import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaModule } from 'src/agenda/agenda.module';
import { CommentsResolver } from './comments.resolver';
import { CommentsService } from './comments.service';
import { Comments } from './entities/comments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comments]), AgendaModule],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
