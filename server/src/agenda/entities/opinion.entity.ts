import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Agenda } from './agenda.entity';
import { Vote } from './vote.entity';

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

  @Field((type) => Agenda, { nullable: true })
  @ManyToOne(() => Agenda, (agenda) => agenda.opinions)
  agenda: Agenda;

  @Field((type) => [Vote])
  @OneToMany(() => Vote, (vote) => vote.opinion)
  vote: Vote[];

  @Column({ default: 0 })
  @Field((type) => Int, { defaultValue: 0 })
  votedUserCount: number;
}
