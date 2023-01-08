import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class RefreshTokens extends CommonEntity {
  @Column({ nullable: true })
  @Field((type) => String)
  @IsString()
  refreshToken?: string;

  @Field((type) => User)
  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn()
  user: User;
}
