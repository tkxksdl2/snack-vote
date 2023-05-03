import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { JwtService, TokenType } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/create-user.dto';
import { FindUserByIdOutput } from './dtos/find-one-by-id.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User, UserRole } from './entities/user.entity';
import { RefreshInput, RefreshOutput } from './dtos/refresh.dto';
import { DeleteUserInput, DeleteUserOutput } from './dtos/delete-user.dto';
import { UpdateUserInput, UpdateUserOutput } from './dtos/update-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { REFRESH_TOKEN_EXP_TIME } from 'src/common/common.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {}

  async findOneById(id: number): Promise<FindUserByIdOutput> {
    try {
      const user = await this.users.findOneOrFail({ where: { id } });
      return { ok: true, user };
    } catch {
      return { ok: false, error: 'Unexeptable id or wrong token' };
    }
  }

  async createUser({
    email,
    name,
    password,
    role,
    sex,
    birth,
  }: CreateUserInput): Promise<CommonOutput> {
    try {
      const exists = await this.users.findOne({
        where: { email },
        withDeleted: true,
      });
      if (exists) {
        return { ok: false, error: 'User with the email is already exists.' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, name, role, sex, birth }),
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create User" };
    }
  }

  async updateUser(
    meId: number,
    meRole: UserRole,
    { inputId, email, password, name, profileImage }: UpdateUserInput,
  ): Promise<UpdateUserOutput> {
    try {
      const { ok, error, user } = await this.findOneById(inputId);
      if (!ok) {
        return { ok, error };
      }
      if (meRole !== UserRole.Admin && meId !== user.id) {
        return {
          ok: false,
          error: "You don't have permission to update this user",
        };
      }
      // if (email) user.email = email;
      // if (profileImage) user.profileImage = profileImage;
      if (name && user.name !== name) {
        const nameExist = await this.users.findOne({ where: { name } });
        if (nameExist) {
          return { ok: false, error: 'Input Name already exist' };
        }
        user.name = name;
      }
      if (password) user.password = password;
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch {
      return { ok: false, error: "Couldn't update User" };
    }
  }

  async deleteUser(
    meId: number,
    meRole: UserRole,
    { id }: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    try {
      const user = await this.users.findOne({
        where: { id },
        relations: ['agendas', 'comments'],
      });
      if (!user) {
        return { ok: false, error: 'User does not exist.' };
      }
      if (meRole !== UserRole.Admin && user.id !== meId) {
        return {
          ok: false,
          error: "You don't have permission to delete this User",
        };
      }
      await this.users.softRemove(user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't delete User" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
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
      const accessToken = this.jwtService.sign(
        { id: user.id },
        TokenType.Access,
      );
      const refreshToken = this.jwtService.sign(
        { id: user.id },
        TokenType.Refresh,
      );
      await this.cacheManager.set(
        `user:${user.id}:refresh-token`,
        refreshToken,
        REFRESH_TOKEN_EXP_TIME,
      );
      return { ok: true, accessToken, userId: user.id };
    } catch {
      return { ok: false, error: "Couldn't get token" };
    }
  }

  /** refresh access token if refresh token is valid */
  async refresh({ accessToken, userId }: RefreshInput): Promise<RefreshOutput> {
    try {
      const refreshToken = await this.cacheManager.get<string>(
        `user:${userId}:refresh-token`,
      );
      if (!refreshToken) {
        return { ok: false, error: 'Refresh Token does not exist' };
      }
      const refreshTokenPayload = this.jwtService.verify(
        refreshToken,
        TokenType.Refresh,
      );
      const expiredPayload =
        this.jwtService.verifyExpiredAccessToken(accessToken);
      if (
        typeof expiredPayload === 'object' &&
        typeof refreshTokenPayload === 'object' &&
        expiredPayload.id !== refreshTokenPayload.id
      ) {
        return {
          ok: false,
          error: 'Wrong access token or token has been tampered.',
        };
      }
      const newAccessToken = this.jwtService.sign(
        { id: userId },
        TokenType.Access,
      );
      return { ok: true, newAccessToken };
    } catch (e) {
      return {
        ok: false,
        error: "Couldn't refresh token. Refresh Token could be expired.",
      };
    }
  }
}
