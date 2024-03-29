import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService, TokenType } from 'src/jwt/jwt.service';
import { expectCalledTimesAndWith } from 'test/hook/test-hook';
import { Repository } from 'typeorm';
import { Sex, User, UserRole } from './entities/user.entity';
import { UserService } from './user.service';
import { Cache } from 'cache-manager';
import { REFRESH_TOKEN_EXP_TIME } from 'src/common/common.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';

const mockRepository = () => ({
  findOne: jest.fn(),
  findOneOrFail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  softRemove: jest.fn(),
  delete: jest.fn(),
});
const [FAKE_TOKEN, FAKE_REFRESH_TOKEN] = ['fake-token', 'fake-refresh-token'];
const mockJwtService = {
  sign: jest.fn((_, tokenType: TokenType) => {
    if (tokenType === TokenType.Access) return FAKE_TOKEN;
    else if (tokenType === TokenType.Refresh) return FAKE_REFRESH_TOKEN;
  }),
  verify: jest.fn(),
  verifyExpiredAccessToken: jest.fn(() => FAKE_TOKEN),
};
const mockCacheManager = {
  set: jest.fn(),
  get: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;
  let cacheManager: Cache;
  let jwtService: JwtService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get(getRepositoryToken(User));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create Root Admin User', async () => {
      jest.spyOn(service, 'createUser').mockImplementationOnce(jest.fn());
      await service.onModuleInit();
      expectCalledTimesAndWith(service.createUser, 1, [
        {
          email: process.env.ROOT_EMAIL,
          password: process.env.ROOT_PASSWORD,
          name: process.env.ROOT_NAME,
          sex: Sex.Male,
          role: UserRole.Admin,
          birth: new Date('1997-04-16'),
        },
      ]);
    });
    it('should fail and log error', async () => {
      jest.spyOn(service, 'createUser').mockImplementationOnce(() => {
        throw new Error();
      });
      jest.spyOn(Logger, 'error').mockImplementationOnce(jest.fn());

      await service.onModuleInit();
      expect(Logger.error).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    const findOneResult = {
      id: 1,
      email: 'test',
    };
    it('should return user if success', async () => {
      userRepository.findOneOrFail.mockResolvedValue(findOneResult);
      const result = await service.findOneById(1);
      expect(result).toMatchObject({
        ok: true,
        user: findOneResult,
      });
    });
    it('should return false if fail', async () => {
      userRepository.findOneOrFail.mockRejectedValue(new Error('error'));
      const result = await service.findOneById(1);
      expect(result).toMatchObject({
        ok: false,
        error: 'Unexeptable id or wrong token',
      });
    });
  });
  describe('createUser', () => {
    const createUserArgs = {
      email: 'test-email',
      name: 'test-name',
      password: 'test-pass',
      role: UserRole.Client,
      sex: Sex.Male,
      birth: new Date(),
    };
    it('should fail if email exist', async () => {
      userRepository.findOne.mockResolvedValue('exist');
      const result = await service.createUser(createUserArgs);
      expectCalledTimesAndWith(userRepository.findOne, 1, [
        {
          where: { email: createUserArgs.email },
          withDeleted: true,
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'User with the email is already exists.',
      });
    });
    it('should create User', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createUserArgs);
      const result = await service.createUser(createUserArgs);
      expectCalledTimesAndWith(userRepository.create, 1, [createUserArgs]);
      expectCalledTimesAndWith(userRepository.save, 1, [createUserArgs]);
      expect(result).toMatchObject({ ok: true });
    });
    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createUser(createUserArgs);
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't create User",
      });
    });
  });
  describe('updateUser', () => {
    const oldClientUser = {
      id: 1,
      email: 'old-email',
      name: 'old-name',
      password: 'old-pass',
      role: UserRole.Client,
    };
    const updateUserArgs = {
      inputId: 1,
      email: 'test-email',
      name: 'test-name',
      password: 'test-pass',
      profileImage: 'test-path',
    };
    it('should fail if user not found', async () => {
      jest
        .spyOn(service, 'findOneById')
        .mockImplementation(async () => ({ ok: false, error: 'e' }));
      const result = await service.updateUser(
        oldClientUser.id,
        oldClientUser.role,
        updateUserArgs,
      );
      expectCalledTimesAndWith(service.findOneById, 1, [
        updateUserArgs.inputId,
      ]);
      expect(result).toMatchObject({ ok: false, error: 'e' });
    });

    beforeEach(() => {
      jest
        .spyOn(service, 'findOneById')
        .mockResolvedValue({ ok: true, user: { ...oldClientUser } });
    });

    it('should fail if user is client and not match id', async () => {
      const result = await service.updateUser(
        4444,
        oldClientUser.role,
        updateUserArgs,
      );
      expect(result).toMatchObject({
        ok: false,
        error: "You don't have permission to update this user",
      });
    });
    it('should fail if name already exists', async () => {
      userRepository.findOne.mockResolvedValue('exsist');
      const result = await service.updateUser(
        oldClientUser.id,
        oldClientUser.role,
        updateUserArgs,
      );
      expectCalledTimesAndWith(userRepository.findOne, 1, [
        {
          where: { name: updateUserArgs.name },
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'Input Name already exist',
      });
    });
    it('should update user', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.updateUser(
        oldClientUser.id,
        oldClientUser.role,
        updateUserArgs,
      );
      expectCalledTimesAndWith(userRepository.save, 1, [
        {
          ...oldClientUser,
          name: updateUserArgs.name,
          password: updateUserArgs.password,
        },
      ]);
      expect(result).toMatchObject({ ok: true });
    });
    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.updateUser(
        oldClientUser.id,
        oldClientUser.role,
        updateUserArgs,
      );
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't update User",
      });
    });
  });
  describe('deleteUser', () => {
    const USER_ID = 1;
    const USER_ROLE = UserRole.Client;
    const DELETE_ID = 1;
    const WRONG_ID = 4444;
    it('should fail if user not exist', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.deleteUser(USER_ID, USER_ROLE, {
        id: DELETE_ID,
      });
      expectCalledTimesAndWith(userRepository.findOne, 1, [
        {
          where: { id: DELETE_ID },
          relations: ['agendas', 'comments'],
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'User does not exist.',
      });
    });
    it('should fail if user is not admin and not match id', async () => {
      userRepository.findOne.mockResolvedValue({ id: WRONG_ID });
      const result = await service.deleteUser(USER_ID, USER_ROLE, {
        id: WRONG_ID,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "You don't have permission to delete this User",
      });
    });
    it('should delete user (soft-remove)', async () => {
      userRepository.findOne.mockResolvedValue({ id: DELETE_ID });
      const result = await service.deleteUser(USER_ID, USER_ROLE, {
        id: DELETE_ID,
      });
      expectCalledTimesAndWith(userRepository.softRemove, 1, [
        { id: DELETE_ID },
      ]);
      expect(result).toMatchObject({ ok: true });
    });
    it('should fail on exection', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.deleteUser(USER_ID, USER_ROLE, {
        id: DELETE_ID,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't delete User",
      });
    });
  });
  describe('login', () => {
    const EMAIL = 'test-email';
    const PASSWORD = 'test-pass';
    const ID = 1;
    it('should fail on user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.login({ email: EMAIL, password: PASSWORD });
      expectCalledTimesAndWith(userRepository.findOne, 1, [
        {
          where: { email: EMAIL },
          select: ['id', 'password'],
        },
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'User not found',
      });
    });
    it('should fail on not match password', async () => {
      const comparePassword = jest.fn(() => Promise.resolve(false));
      userRepository.findOne.mockResolvedValue({
        id: ID,
        comparePassword,
      });
      const result = await service.login({ email: EMAIL, password: PASSWORD });
      expectCalledTimesAndWith(comparePassword, 1, [PASSWORD]);
      expect(result).toMatchObject({
        ok: false,
        error: 'Password not correct',
      });
    });
    it('should login', async () => {
      const comparePassword = jest.fn(() => Promise.resolve(true));
      userRepository.findOne.mockResolvedValue({
        id: ID,
        comparePassword,
      });
      const result = await service.login({ email: EMAIL, password: PASSWORD });
      expectCalledTimesAndWith(
        jwtService.sign,
        2,
        [{ id: ID }, TokenType.Access],
        [{ id: ID }, TokenType.Refresh],
      );
      expect(jwtService.sign).toReturnWith(FAKE_TOKEN);
      expectCalledTimesAndWith(cacheManager.set, 1, [
        `user:${ID}:refresh-token`,
        FAKE_REFRESH_TOKEN,
        REFRESH_TOKEN_EXP_TIME,
      ]);
      expect(result).toMatchObject({
        ok: true,
        accessToken: FAKE_TOKEN,
        userId: ID,
      });
    });
    it('should fail on exception', async () => {
      userRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login({ email: EMAIL, password: PASSWORD });
      expect(result).toMatchObject({ ok: false, error: "Couldn't get token" });
    });
  });
  describe('refresh', () => {
    const ACCESS_TOKEN = 'fake-token';
    const USER_ID = 3;
    it('should fail if refresh token not exist', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(undefined);
      const result = await service.refresh({
        accessToken: ACCESS_TOKEN,
        userId: USER_ID,
      });
      expectCalledTimesAndWith(cacheManager.get, 1, [
        `user:${USER_ID}:refresh-token`,
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'Refresh Token does not exist',
      });
    });
    it('should fail if token not match', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(FAKE_REFRESH_TOKEN);
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id: USER_ID });
      jest
        .spyOn(jwtService, 'verifyExpiredAccessToken')
        .mockReturnValueOnce({ id: 4444 });
      const result = await service.refresh({
        accessToken: ACCESS_TOKEN,
        userId: USER_ID,
      });
      expectCalledTimesAndWith(jwtService.verify, 1, [
        FAKE_REFRESH_TOKEN,
        TokenType.Refresh,
      ]);
      expectCalledTimesAndWith(jwtService.verifyExpiredAccessToken, 1, [
        ACCESS_TOKEN,
      ]);
      expect(result).toMatchObject({
        ok: false,
        error: 'Wrong access token or token has been tampered.',
      });
    });
    it('should refresh and return new access token', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(FAKE_REFRESH_TOKEN);
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce({ id: USER_ID });
      jest
        .spyOn(jwtService, 'verifyExpiredAccessToken')
        .mockReturnValueOnce({ id: USER_ID });
      const result = await service.refresh({
        accessToken: ACCESS_TOKEN,
        userId: USER_ID,
      });
      expectCalledTimesAndWith(jwtService.sign, 1, [
        { id: USER_ID },
        TokenType.Access,
      ]);
      expect(result).toMatchObject({ ok: true, newAccessToken: FAKE_TOKEN });
    });
    it('should fail on exception', async () => {
      jest.spyOn(cacheManager, 'get').mockRejectedValue(new Error());
      const result = await service.refresh({
        accessToken: ACCESS_TOKEN,
        userId: USER_ID,
      });
      expect(result).toMatchObject({
        ok: false,
        error: "Couldn't refresh token. Refresh Token could be expired.",
      });
    });
  });
});
