import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Agenda } from './agenda.entity';

@InputType('OpinionInputtype', { isAbstract: true })
@ObjectType()
@Entity()
export class Opinion extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  opinionText: string;

  @Column()
  @Field((type) => Boolean)
  @IsBoolean()
  opinionType: boolean;

  @Field((type) => Agenda)
  @ManyToOne(() => Agenda, (agenda) => agenda.opinions, {
    onDelete: 'CASCADE',
  })
  agenda: Agenda;

  @Field((type) => [User], { nullable: true })
  @ManyToMany(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable()
  votedUser?: User[];

  @Field((type) => [Number], { nullable: true })
  @RelationId('votedUser')
  votedUserId?: number[];

  @Column({ default: 0 })
  @Field((type) => Int, { defaultValue: 0 })
  votedUserCount: number;
}
