import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { JwtService, TokenType } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/create-user.dto';
import { FindUserByIdOutput } from './dtos/find-one-by-id.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { RefreshTokens } from './entities/refresh-tokens.entity';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RefreshInput, RefreshOutput } from './dtos/refresh.dto';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(RefreshTokens)
    private readonly refreshTokens: Repository<RefreshTokens>,

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
      this.deleteRefreshToken(user.id);
      const { id: refreshTokenId } = await this.refreshTokens.save(
        this.refreshTokens.create({ refreshToken, user }),
      );
      // const hashedRefreshTokenId = await bcrypt.hash(
      //   await bcrypt.genSalt(10),
      //   refreshTokenId,
      // );
      return { ok: true, accessToken, refreshTokenId };
    } catch {
      return { ok: false, error: "Couldn't get token" };
    }
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    const oldRefreshToken = await this.refreshTokens.findOne({
      where: { user: { id: userId } },
    });
    if (oldRefreshToken) {
      await this.refreshTokens.delete({ id: oldRefreshToken.id });
    }
  }

  //**refresh access token if refresh token is valid */
  async refresh({
    accessToken,
    refreshTokenId,
  }: RefreshInput): Promise<RefreshOutput> {
    try {
      const expiredPayload =
        this.jwtService.verifyExpiredAccessToken(accessToken);
      const refreshToken = await this.refreshTokens.findOneOrFail({
        where: { id: refreshTokenId },
        relations: ['user'],
      });
      if (!refreshToken) {
        return { ok: false, error: 'Refresh Token does not exist' };
      }
      const refreshTokenPayload = this.jwtService.verify(
        refreshToken.refreshToken,
        TokenType.Refresh,
      );
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
        { id: refreshToken.user.id },
        TokenType.Access,
      );
      return { ok: false, newAccessToken };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: "Couldn't refresh token. Refresh Token could be expired.",
      };
    }
  }

  async findOneById(id: number): Promise<FindUserByIdOutput> {
    try {
      const user = await this.users.findOneOrFail({ where: { id } });
      return { ok: true, user };
    } catch {
      return { ok: false, error: 'Unexeptable id or wrong token' };
    }
  }
}
