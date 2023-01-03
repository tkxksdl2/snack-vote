import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Agenda } from './agenda.entity';

@Entity()
@ObjectType()
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
  @ManyToOne(() => Agenda, (agenda) => agenda.opinions, { onDelete: 'CASCADE' })
  agenda: Agenda;

  @Field((type) => [User])
  @ManyToMany(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinTable()
  agreedUser?: User[];
}
