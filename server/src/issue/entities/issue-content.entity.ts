import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Issue } from './issue.entity';

@InputType('IssueContentInputtype', { isAbstract: true })
@ObjectType()
@Entity()
export class IssueContent extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(5, 1000)
  content: string;

  @Field((type) => Issue)
  @ManyToOne(() => Issue, (issue) => issue.issueContents, {
    onDelete: 'CASCADE',
  })
  issue: Issue;

  @Field((type) => User, { nullable: true })
  @ManyToOne(() => User, (author) => author.issues, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  author?: User;
}
