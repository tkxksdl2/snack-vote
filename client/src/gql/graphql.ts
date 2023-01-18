/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Agenda = {
  __typename?: 'Agenda';
  author?: Maybe<User>;
  comments: Array<Comments>;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  opinions: Array<Opinion>;
  seriousness: Scalars['Float'];
  subject: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Comments = {
  __typename?: 'Comments';
  agenda: Agenda;
  author?: Maybe<User>;
  bundleId: Scalars['Int'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  depth: Scalars['Int'];
  id: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
};

export type CommonOutput = {
  __typename?: 'CommonOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateAgendaInput = {
  opinionA: Scalars['String'];
  opinionB: Scalars['String'];
  seriousness: Scalars['Float'];
  subject: Scalars['String'];
};

export type CreateAgendaOutput = {
  __typename?: 'CreateAgendaOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  result?: Maybe<Agenda>;
};

export type CreateCommentsInput = {
  agendaId: Scalars['Int'];
  bundleId?: InputMaybe<Scalars['Int']>;
  content: Scalars['String'];
};

export type CreateCommentsOutput = {
  __typename?: 'CreateCommentsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  role: UserRole;
};

export type DeleteAgendaInput = {
  agendaId: Scalars['Int'];
};

export type DeleteAgendaOutput = {
  __typename?: 'DeleteAgendaOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type DeleteCommentsInput = {
  commentsId: Scalars['Int'];
};

export type DeleteCommentsOutput = {
  __typename?: 'DeleteCommentsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type DeleteUserInput = {
  id: Scalars['Int'];
};

export type DeleteUserOutput = {
  __typename?: 'DeleteUserOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type FindAgendaByIdInput = {
  id: Scalars['Float'];
};

export type FindAgendaByIdOutput = {
  __typename?: 'FindAgendaByIdOutput';
  agenda?: Maybe<Agenda>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type GetAllAgendasInput = {
  page?: InputMaybe<Scalars['Int']>;
};

export type GetAllAgendasOutput = {
  __typename?: 'GetAllAgendasOutput';
  agendas?: Maybe<Array<Agenda>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
};

export type GetCommentsByAgendaInput = {
  agendaId: Scalars['Int'];
  page?: InputMaybe<Scalars['Int']>;
};

export type GetCommentsByAgendaOutput = {
  __typename?: 'GetCommentsByAgendaOutput';
  comments?: Maybe<Array<Comments>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
};

export type GetMyAgendasInput = {
  page?: InputMaybe<Scalars['Int']>;
};

export type GetVotedAgendasInput = {
  page?: InputMaybe<Scalars['Int']>;
};

export type GetVotedAgendasOutput = {
  __typename?: 'GetVotedAgendasOutput';
  agendas?: Maybe<Array<Agenda>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
};

export type GetmyAgendasOutput = {
  __typename?: 'GetmyAgendasOutput';
  agendas?: Maybe<Array<Agenda>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  accessToken?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  refreshTokenId?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAgenda: CreateAgendaOutput;
  createComments: CreateCommentsOutput;
  createUser: CommonOutput;
  deleteAgenda: DeleteAgendaOutput;
  deleteComments: DeleteCommentsOutput;
  deleteUser: DeleteUserOutput;
  login: LoginOutput;
  refresh: RefreshOutput;
  updateUser: UpdateUserOutput;
  voteOrUnvote: VoteOrUnvoteOutput;
};


export type MutationCreateAgendaArgs = {
  input: CreateAgendaInput;
};


export type MutationCreateCommentsArgs = {
  input: CreateCommentsInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteAgendaArgs = {
  input: DeleteAgendaInput;
};


export type MutationDeleteCommentsArgs = {
  input: DeleteCommentsInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshArgs = {
  input: RefreshInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationVoteOrUnvoteArgs = {
  input: VoteOrUnvoteInput;
};

export type Opinion = {
  __typename?: 'Opinion';
  agenda: Agenda;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  opinionText: Scalars['String'];
  opinionType: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  votedUser: Array<User>;
  votedUserCount: Scalars['Int'];
  votedUserId?: Maybe<Array<Scalars['Float']>>;
};

export type Query = {
  __typename?: 'Query';
  findAgendaById: FindAgendaByIdOutput;
  getAllAgendas: GetAllAgendasOutput;
  getCommentsByAgenda: GetCommentsByAgendaOutput;
  getMyAgendas: GetmyAgendasOutput;
  getVotedAgendas: GetVotedAgendasOutput;
  me: Scalars['Boolean'];
};


export type QueryFindAgendaByIdArgs = {
  input: FindAgendaByIdInput;
};


export type QueryGetAllAgendasArgs = {
  input: GetAllAgendasInput;
};


export type QueryGetCommentsByAgendaArgs = {
  input: GetCommentsByAgendaInput;
};


export type QueryGetMyAgendasArgs = {
  input: GetMyAgendasInput;
};


export type QueryGetVotedAgendasArgs = {
  input: GetVotedAgendasInput;
};

export type RefreshInput = {
  accessToken: Scalars['String'];
  refreshTokenId: Scalars['Int'];
};

export type RefreshOutput = {
  __typename?: 'RefreshOutput';
  error?: Maybe<Scalars['String']>;
  newAccessToken?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type RefreshTokens = {
  __typename?: 'RefreshTokens';
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  refreshToken: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']>;
  inputId: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  profileImage?: InputMaybe<Scalars['String']>;
};

export type UpdateUserOutput = {
  __typename?: 'UpdateUserOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type User = {
  __typename?: 'User';
  agendas: Array<Agenda>;
  comments: Array<Comments>;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  id: Scalars['Float'];
  name: Scalars['String'];
  password: Scalars['String'];
  profileImage?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<RefreshTokens>;
  role: UserRole;
  updatedAt: Scalars['DateTime'];
  votedOp: Array<Opinion>;
};

export enum UserRole {
  Admin = 'Admin',
  Client = 'Client'
}

export type VoteOrUnvoteInput = {
  otherOpinionId: Scalars['Int'];
  voteId: Scalars['Int'];
};

export type VoteOrUnvoteOutput = {
  __typename?: 'VoteOrUnvoteOutput';
  error?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  voteCount?: Maybe<Scalars['Int']>;
};

export type AgendaPartsFragment = { __typename?: 'Agenda', id: number, subject: string, seriousness: number, opinions: Array<{ __typename?: 'Opinion', id: number, opinionText: string, votedUserCount: number }> } & { ' $fragmentName'?: 'AgendaPartsFragment' };

export type CommentPartsFragment = { __typename?: 'Comments', id: number, bundleId: number, content: string, createdAt: any, deletedAt?: any | null, depth: number, author?: { __typename?: 'User', name: string } | null } & { ' $fragmentName'?: 'CommentPartsFragment' };

export type GetAllAgendasQueryVariables = Exact<{
  input: GetAllAgendasInput;
}>;


export type GetAllAgendasQuery = { __typename?: 'Query', getAllAgendas: { __typename?: 'GetAllAgendasOutput', ok: boolean, error?: string | null, totalPage?: number | null, agendas?: Array<(
      { __typename?: 'Agenda' }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    )> | null } };

export type GetAgendaAndCommentsQueryVariables = Exact<{
  commentsInput: GetCommentsByAgendaInput;
  agendaInput: FindAgendaByIdInput;
}>;


export type GetAgendaAndCommentsQuery = { __typename?: 'Query', getCommentsByAgenda: { __typename?: 'GetCommentsByAgendaOutput', ok: boolean, error?: string | null, totalPage?: number | null, comments?: Array<(
      { __typename?: 'Comments' }
      & { ' $fragmentRefs'?: { 'CommentPartsFragment': CommentPartsFragment } }
    )> | null }, findAgendaById: { __typename?: 'FindAgendaByIdOutput', ok: boolean, error?: string | null, agenda?: (
      { __typename?: 'Agenda', author?: { __typename?: 'User', id: number, name: string } | null }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    ) | null } };

export const AgendaPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgendaParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agenda"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"seriousness"}},{"kind":"Field","name":{"kind":"Name","value":"opinions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"opinionText"}},{"kind":"Field","name":{"kind":"Name","value":"votedUserCount"}}]}}]}}]} as unknown as DocumentNode<AgendaPartsFragment, unknown>;
export const CommentPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comments"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bundleId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CommentPartsFragment, unknown>;
export const GetAllAgendasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllAgendas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAllAgendasInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllAgendas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"agendas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAllAgendasQuery, GetAllAgendasQueryVariables>;
export const GetAgendaAndCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAgendaAndComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentsInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetCommentsByAgendaInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agendaInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindAgendaByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCommentsByAgenda"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentParts"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"findAgendaById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agendaInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"agenda"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},...CommentPartsFragmentDoc.definitions,...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAgendaAndCommentsQuery, GetAgendaAndCommentsQueryVariables>;