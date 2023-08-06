import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IssueContent } from './issue-content.entity';

@InputType('IssueInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Issue extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  subject: string;

  @Column({ default: false })
  @Field({ defaultValue: false })
  @IsBoolean()
  hasAnswer: boolean;

  @Field((type) => [IssueContent], { nullable: true })
  @OneToMany(() => IssueContent, (content) => content.issue, {
    nullable: true,
    cascade: ['insert'],
  })
  issueContents: IssueContent[];

  @Field((type) => Int)
  @Column({ default: 1 })
  @IsInt()
  contentCount: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne(() => User, (author) => author.issues, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  author?: User;
}
