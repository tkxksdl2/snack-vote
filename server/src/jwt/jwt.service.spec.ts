import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService, TokenType } from './jwt.service';
import * as jwt from 'jsonwebtoken';
import { expectCalledTimesAndWith } from 'test/hook/test-hook';

const FAKE_ACCESS_TOKEN = 'fake-access-token';
const FAKE_REFRESH_TOKEN = 'fake-refresh-token';

const TEST_PRIVATE_KEY = 'test-private-key';
const TEST_PRIVATE_KEY_EXP_TIME = 'test-private-exp-time';
const TEST_REFRESH_KEY = 'test-refresh-key';
const TEST_REFRESH_KEY_EXP_TIME = 'test-refresh-exp-time';

const FAKE_PAYLOAD = { id: 1 };

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(
    (payload: string, key: string, option: { expiresIn: string }) => {
      if (key === TEST_PRIVATE_KEY) return FAKE_ACCESS_TOKEN;
      else if (key === TEST_REFRESH_KEY) return FAKE_REFRESH_TOKEN;
    },
  ),
  verify: jest.fn(() => FAKE_PAYLOAD),
}));

describe('JwtService', () => {
  let service: JwtService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            accessTokenKey: TEST_PRIVATE_KEY,
            accessTokenExpTime: TEST_PRIVATE_KEY_EXP_TIME,
            refreshTokenKey: TEST_REFRESH_KEY,
            refreshTokenExpTime: TEST_REFRESH_KEY_EXP_TIME,
          },
        },
      ],
    }).compile();
    service = module.get<JwtService>(JwtService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sign', () => {
    it('should return accessToken if tokenType Access', () => {
      const token = service.sign(FAKE_PAYLOAD, TokenType.Access);
      expectCalledTimesAndWith(jwt.sign, 1, [
        FAKE_PAYLOAD,
        TEST_PRIVATE_KEY,
        {
          expiresIn: TEST_PRIVATE_KEY_EXP_TIME,
        },
      ]);
      expect(token).toEqual(FAKE_ACCESS_TOKEN);
    });
    it('should return refreshToken if tokenType Refresh', () => {
      const token = service.sign(FAKE_PAYLOAD, TokenType.Refresh);
      expectCalledTimesAndWith(jwt.sign, 1, [FAKE_PAYLOAD, TEST_REFRESH_KEY]);
      expect(token).toEqual(FAKE_REFRESH_TOKEN);
    });
  });
  describe('verify', () => {
    it('should return payload and use access key', () => {
      const payload = service.verify(FAKE_ACCESS_TOKEN, TokenType.Access);
      expectCalledTimesAndWith(jwt.verify, 1, [
        FAKE_ACCESS_TOKEN,
        TEST_PRIVATE_KEY,
      ]);
      expect(payload).toEqual(FAKE_PAYLOAD);
    });
    it('should return payload and use resfresh key', () => {
      const payload = service.verify(FAKE_REFRESH_TOKEN, TokenType.Refresh);
      expectCalledTimesAndWith(jwt.verify, 1, [
        FAKE_REFRESH_TOKEN,
        TEST_REFRESH_KEY,
      ]);
      expect(payload).toEqual(FAKE_PAYLOAD);
    });
  });
  describe('verifyExpiredAccessToken', () => {
    it('should return payload', () => {
      service.verifyExpiredAccessToken(FAKE_ACCESS_TOKEN);
      expectCalledTimesAndWith(jwt.verify, 1, [
        FAKE_ACCESS_TOKEN,
        TEST_PRIVATE_KEY,
        {
          ignoreExpiration: true,
        },
      ]);
    });
  });
});
