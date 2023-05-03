import { gql } from "@apollo/client";

export const ME = gql`
  query me {
    me {
      id
      email
      name
      role
      sex
      birth
    }
  }
`;

export const LOGIN = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      error
      ok
      accessToken
      userId
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

export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ok
      error
    }
  }
`;
