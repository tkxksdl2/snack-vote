import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsIn, IsInt, IsString, Length } from 'class-validator';
import { Agenda } from 'src/agenda/entities/agenda.entity';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { User } from '../../users/entities/user.entity';

@InputType('CommentsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Comments extends CommonEntity {
  @IsString()
  @Length(2, 150)
  @Field((type) => String)
  @Column()
  content: string;

  @IsInt()
  @Field((type) => Int)
  @Column({ nullable: true })
  bundleId?: number;

  @IsInt()
  @IsIn([0, 1])
  @Field((type) => Int)
  @Column({ default: 0 })
  depth: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  author?: User;

  @Field((type) => Agenda, { nullable: true })
  @ManyToOne(() => Agenda, (agenda) => agenda.comments)
  agenda: Agenda;

  @BeforeInsert()
  setDepth() {
    if (this.bundleId) this.depth = 1;
  }
}
