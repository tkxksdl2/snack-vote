import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/create-user.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser({
    email,
    name,
    password,
    role,
  }: CreateUserInput): Promise<CommonOutput> {
    try {
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        return { ok: false, error: 'User with the email is already exists.' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, name, role }),
      );
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't create User" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      console.log('s');
      const user = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrent = await user.comparePassword(password);
      if (!passwordCorrent) {
        return { ok: false, error: 'Password not correct' };
      }
      const token = this.jwtService.sign({ id: user.id });
      return { ok: true, token };
    } catch {
      return { ok: false, error: "Couldn't get token" };
    }
  }
}
