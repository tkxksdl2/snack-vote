import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Agenda } from 'src/agenda/entities/agenda.entity';
import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';
import { Comments } from '../../comments/entities/comments.entity';
import { Vote } from 'src/agenda/entities/vote.entity';
import { Issue } from 'src/issue/entities/issue.entity';

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

  @Field((type) => [Agenda])
  @OneToMany(() => Agenda, (agenda) => agenda.author, {
    nullable: true,
  })
  agendas?: [Agenda];

  @Field((type) => [Vote])
  @OneToMany(() => Vote, (vote) => vote.user, { nullable: true })
  vote?: Vote[];

  @Field((type) => [Comments])
  @OneToMany(() => Comments, (comments) => comments.author, {
    nullable: true,
  })
  comments?: Comments[];

  @Field((type) => [Issue])
  @OneToMany(() => Issue, (issue) => issue.author, { nullable: true })
  issues?: Issue[];

  @Field((type) => [Issue])
  @OneToMany(() => Issue, (issue) => issue.author, { nullable: true })
  issueContents?: Issue[];

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
