import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Opinion } from 'src/agenda/entities/opinion.entity';
import { Agenda } from 'src/agenda/entities/agenda.entity';
import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';
import { RefreshTokens } from './refresh-tokens.entity';
import { Comments } from '../../comments/entities/comments.entity';

export enum UserRole {
  Client = 'Client',
  Admin = 'Admin',
}

export enum Sex {
  Male = 'M',
  Female = 'F',
}

registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(Sex, { name: 'Sex' });

@InputType('UserInputtype', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CommonEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsString()
  role: UserRole;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  profileImage?: string;

  @Column()
  @Field((type) => Sex)
  @IsEnum(Sex)
  sex?: Sex;

  @Column()
  @Field((type) => Date)
  @IsDate()
  birth?: Date;

  @Field((type) => RefreshTokens, { nullable: true })
  @OneToOne(() => RefreshTokens, (ref) => ref.user, { nullable: true })
  refreshToken?: RefreshTokens;

  @Field((type) => [Agenda])
  @OneToMany(() => Agenda, (agenda) => agenda.author, {
    nullable: true,
  })
  agendas?: [Agenda];

  @Field((type) => [Opinion])
  @ManyToMany(() => Opinion, { nullable: true, cascade: ['soft-remove'] })
  votedOp?: Opinion[];

  @Field((type) => [Comments])
  @OneToMany(() => Comments, (comments) => comments.author, {
    nullable: true,
  })
  comments?: Comments[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      } catch (e) {
        console.log(e);
        throw InternalServerErrorException;
      }
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
