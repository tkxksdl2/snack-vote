import { gql } from "@apollo/client";

export const ME = gql`
  query me {
    me {
      id
      email
      name
      role
    }
  }
`;

export const LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      error
      ok
      accessToken
      refreshTokenId
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ok
      error
    }
  }
`;
