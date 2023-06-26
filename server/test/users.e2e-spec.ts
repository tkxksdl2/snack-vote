import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { GRAPHQL_ENDPOINT } from 'src/common/common.constants';
import { Sex, UserRole } from 'src/users/entities/user.entity';

const createUserQuery = (testUser: object) => `
mutation {
  createUser(input:${testUser}) {
    ok
    error
  }
}
`;

const loginMutation = (email: string, password: string) => `
mutation{
  login(input:{
    email:"${email}",
    password:"${password}"
  }) {
    ok
    error
    accessToken
    userId
  }
}
`;

const meQuery = `
query{
  me{
    id
    email
    name
  }
}
`;

const updateUserMutation = (
  inputId: number,
  email: string,
  password: string,
) => `
mutation{
  updateUser(input:{
    inputId: ${inputId}
    email: "${email}"
    password: "${password}"
  }){
    ok
    error
  }
}
`;

const refreshMutation = (userId: number, accessToken: string) => `
mutation{
  refresh(input:{
    userId:${userId}
    accessToken:"${accessToken}"
  }){
    ok
    error
    newAccessToken
  }
}`;

const deleteUserMutation = (userId: number) => `
mutation{
  deleteUser(input:{
    id:${userId}
  }){
    ok
    error
  }
}`;

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let otherUserToken: string;
  let testUserId: number;
  let otherUserId: number;

  const testUser = {
    email: 'tkxksdl2@gmail.com',
    password: '1234',
    role: UserRole.Client,
    name: 'client',
    sex: Sex.Male,
    birth: Date.now(),
  };

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string, token: string) =>
    baseTest().set('X-JWT', token).send({ query });

  jest.setTimeout(50000);
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const options: DataSourceOptions = {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
    const dataSource = new DataSource(options);
    const connection = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    await app.close();
  });

  describe('createUser', () => {
    test('should create user', (done) => {
      publicTest(createUserQuery(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUser.ok).toBe(true);
          expect(res.body.data.createUser.error).toBe(null);
        });
      done();
    });

    test('should fail if user exists', (done) => {
      publicTest(createUserQuery(testUser))
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUser.ok).toBe(false);
          expect(res.body.data.createUser.error).toEqual(
            'User with the email is already exists.',
          );
        });
      done();
    });
  });

  describe('login', () => {
    test('should login and return token', (done) => {
      publicTest(loginMutation(testUser.email, testUser.password))
        .expect(200)
        .expect((res) => {
          const login = res.body.data.login;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(typeof login.accessToken).toEqual('string');
          expect(typeof login.userId).toEqual('number');
          jwtToken = login.accessToken;
          testUserId = login.userId;
        });
      done();
    });

    test('should fail to login with wrong credentials', (done) => {
      publicTest(loginMutation(testUser.email, 'WRONGPASSWORD'))
        .expect(200)
        .expect((res) => {
          const login = res.body.data.login;
          expect(login.ok).toBe(false);
          expect(login.error).toEqual('Password not correct');
          expect(login.accessToken).toBe(null);
        });
      done();
    });
  });

  describe('me', () => {
    test('should return loggined user', (done) => {
      privateTest(meQuery, jwtToken)
        .expect(200)
        .expect((res) => {
          expect(typeof res.body.data.me.id).toBe('number');
          expect(res.body.data.me.email).toEqual(testUser.email);
          expect(res.body.data.me.name).toEqual(testUser.name);
        });
      done();
    });
  });

  describe('updateUser', () => {
    const updatedEmail = 'updated@gmail.com';
    const updatedPassword = 'BEDSSA';

    beforeAll(() => {
      publicTest(
        createUserQuery({
          email: 'another@gmail.com',
          password: '1234',
          role: UserRole.Client,
          name: 'client',
          sex: Sex.Male,
          birth: Date.now(),
        }),
      ).expect(200);
      publicTest(loginMutation('another@gmail.com', '1234'))
        .expect(200)
        .expect((res) => {
          otherUserToken = res.body.data.login.accessToken;
          otherUserId = res.body.data.login.userId;
        });
    });

    test('should update email and password', (done) => {
      privateTest(
        updateUserMutation(testUserId, updatedEmail, updatedPassword),
        jwtToken,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateUser.ok).toBe(true);
          expect(res.body.data.updateUser.error).toBe(null);
          testUser.email = updatedEmail;
          testUser.password = updatedPassword;
        });
      publicTest(loginMutation(testUser.email, testUser.password))
        .expect(200)
        .expect((res) => {
          expect(res.body.data.login.ok).toBe(true);
          jwtToken = res.body.data.login.accessToken;
        });
      done();
    });

    test('should denied if does not have permission', (done) => {
      privateTest(
        updateUserMutation(testUserId, updatedEmail, updatedPassword),
        otherUserToken,
      )
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updatedUser.ok).toBe(false);
          expect(res.body.data.updatedUser.error).toEqual(
            "You don't have permission to update this user",
          );
        });
      done();
    });
  });

  describe('refresh', () => {
    test('should fail if refresh token not found', (done) => {
      publicTest(refreshMutation(4444, jwtToken))
        .expect(200)
        .expect((res) => {
          expect(res.body.data.refresh.ok).toBe(false);
          expect(res.body.data.refresh.error).toEqual(
            'Refresh Token does not exist',
          );
        });
      done();
    });

    test('should fail with wrong access token', (done) => {
      publicTest(refreshMutation(testUserId, otherUserToken))
        .expect(200)
        .expect((res) => {
          expect(res.body.data.refresh.ok).toBe(false);
          expect(res.body.data.refresh.error).toEqual(
            'Wrong access token or token has been tampered.',
          );
        });
      done();
    });

    test('should refresh access token', (done) => {
      publicTest(refreshMutation(testUserId, otherUserToken))
        .expect(200)
        .expect((res) => {
          expect(res.body.data.refresh.ok).toBe(true);
          expect(res.body.data.refresh.error).toBe(null);
          expect(res.body.data.refresh.newAccessToken).toBeDefined();
          jwtToken = res.body.data.refresh.newAccessToken;
        });
      done();
    });
  });

  describe('deleteUser', () => {
    let adminToken: string;
    beforeAll(() => {
      publicTest(
        createUserQuery({
          email: 'admin@gmail.com',
          password: '1234',
          role: UserRole.Admin,
          name: 'admin',
          sex: Sex.Male,
          birth: Date.now(),
        }),
      ).expect(200);
      publicTest(loginMutation('admin@gmail.com', '1234'))
        .expect(200)
        .expect((res) => {
          adminToken = res.body.data.login.accessToken;
        });
    });

    test('should fail if user not exist', (done) => {
      privateTest(deleteUserMutation(4444), jwtToken)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteUser.ok).toBe(false);
          expect(res.body.data.deleteUser.error).toEqual(
            'User does not exist.',
          );
        });
      done();
    });

    test('should denied if dose not have permission', (done) => {
      privateTest(deleteUserMutation(testUserId), otherUserToken)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteUser.ok).toBe(false);
          expect(res.body.data.deleteUser.error).toEqual(
            "You don't have permission to delete this User",
          );
        });
      done();
    });

    test('should delete user itself', (done) => {
      privateTest(deleteUserMutation(testUserId), jwtToken)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteUser.ok).toBe(true);
          expect(res.body.data.deleteUser.error).toBe(null);
        });
      done();
    });

    test('should delete user by admin', (done) => {
      privateTest(deleteUserMutation(otherUserId), adminToken)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteUser.ok).toBe(true);
          expect(res.body.data.deleteUser.error).toBe(null);
        });
      done();
    });
  });
});
