import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber, IsString, Max, Min } from 'class-validator';
import { Comments } from 'src/comments/entities/comments.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Opinion } from './opinion.entity';

export enum Category {
  Humor = 'humor',
  Social = 'social',
  Game = 'game',
  Culture = 'culture',
}
registerEnumType(Category, { name: 'Category' });

@InputType('AgendaInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Agenda extends CommonEntity {
  @Column()
  @Field((type) => String)
  @IsString()
  subject: string;

  @Column({ type: 'enum', enum: Category })
  @Field((type) => Category)
  @IsEnum(Category)
  @IsString()
  category: Category;

  @Column()
  @Field((type) => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  seriousness: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne(() => User, (author) => author.agendas, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  author?: User;

  @RelationId('author')
  authorId: number;

  @Field((type) => [Comments])
  @OneToMany(() => Comments, (comments) => comments.agenda, {
    cascade: ['remove', 'soft-remove'],
  })
  comments: Comments[];

  @Field((type) => [Opinion])
  @OneToMany(() => Opinion, (opinion) => opinion.agenda, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
    eager: true,
  })
  opinions: Opinion[];
}
