import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueContent } from './entities/issue-content.entity';
import { Issue } from './entities/issue.entity';
import { IssueResolver } from './issue.resolver';
import { IssueService } from './issue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, IssueContent])],
  providers: [IssueResolver, IssueService],
  exports: [IssueService],
})
export class IssueModule {}
