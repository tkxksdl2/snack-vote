import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Opinion } from './opinion.entity';

@ObjectType()
@Entity()
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => String)
  id: string;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Opinion)
  @ManyToOne(() => Opinion, (opinion) => opinion.vote)
  opinion: Opinion;

  @Field((type) => User)
  @ManyToOne(() => User, (user) => user.vote)
  user: User;
}
