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
  category: Category;
  comments: Array<Comments>;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  opinions: Array<Opinion>;
  seriousness: Scalars['Float'];
  subject: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export enum Category {
  Culture = 'Culture',
  Game = 'Game',
  Humor = 'Humor',
  Social = 'Social'
}

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
  category: Category;
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
  comments?: Maybe<Comments>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type CreateUserInput = {
  birth?: InputMaybe<Scalars['DateTime']>;
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  role: UserRole;
  sex?: InputMaybe<Sex>;
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

export type GetAgendasByCategoryInput = {
  category: Category;
  page?: InputMaybe<Scalars['Int']>;
};

export type GetAgendasByCategoryOutput = {
  __typename?: 'GetAgendasByCategoryOutput';
  agendas?: Maybe<Array<Agenda>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
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
  votedUser?: Maybe<Array<User>>;
  votedUserCount: Scalars['Int'];
  votedUserId?: Maybe<Array<Scalars['Float']>>;
};

export type Query = {
  __typename?: 'Query';
  findAgendaById: FindAgendaByIdOutput;
  getAgendasByCategory: GetAgendasByCategoryOutput;
  getAllAgendas: GetAllAgendasOutput;
  getCommentsByAgenda: GetCommentsByAgendaOutput;
  getMyAgendas: GetmyAgendasOutput;
  getVotedAgendas: GetVotedAgendasOutput;
  me: User;
};


export type QueryFindAgendaByIdArgs = {
  input: FindAgendaByIdInput;
};


export type QueryGetAgendasByCategoryArgs = {
  input: GetAgendasByCategoryInput;
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

export enum Sex {
  Female = 'Female',
  Male = 'Male'
}

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
  birth?: Maybe<Scalars['DateTime']>;
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
  sex?: Maybe<Sex>;
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
  voteId?: Maybe<Scalars['Int']>;
};

export type RefreshMutationVariables = Exact<{
  input: RefreshInput;
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: { __typename?: 'RefreshOutput', ok: boolean, error?: string | null, newAccessToken?: string | null } };

export type GetAllAgendasQueryVariables = Exact<{
  input: GetAllAgendasInput;
}>;


export type GetAllAgendasQuery = { __typename?: 'Query', getAllAgendas: { __typename?: 'GetAllAgendasOutput', ok: boolean, error?: string | null, totalPage?: number | null, agendas?: Array<(
      { __typename?: 'Agenda' }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    )> | null } };

export type VotedOpFragment = { __typename?: 'Opinion', votedUserCount: number } & { ' $fragmentName'?: 'VotedOpFragment' };

export type AgendaPartsFragment = { __typename?: 'Agenda', id: number, subject: string, seriousness: number, category: Category, opinions: Array<{ __typename?: 'Opinion', id: number, opinionText: string, votedUserCount: number }> } & { ' $fragmentName'?: 'AgendaPartsFragment' };

export type AgendaDetailPartsFragment = { __typename?: 'Agenda', id: number, subject: string, seriousness: number, category: Category, opinions: Array<{ __typename?: 'Opinion', id: number, opinionText: string, votedUserCount: number, votedUser?: Array<{ __typename?: 'User', id: number, birth?: any | null, sex?: Sex | null }> | null }> } & { ' $fragmentName'?: 'AgendaDetailPartsFragment' };

export type CommentPartsFragment = { __typename?: 'Comments', id: number, bundleId: number, content: string, createdAt: any, deletedAt?: any | null, depth: number, author?: { __typename?: 'User', id: number, name: string } | null } & { ' $fragmentName'?: 'CommentPartsFragment' };

export type GetAgendasByCategoryQueryVariables = Exact<{
  input: GetAgendasByCategoryInput;
}>;


export type GetAgendasByCategoryQuery = { __typename?: 'Query', getAgendasByCategory: { __typename?: 'GetAgendasByCategoryOutput', ok: boolean, error?: string | null, totalPage?: number | null, agendas?: Array<(
      { __typename?: 'Agenda' }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    )> | null } };

export type CreateAgendaMutationVariables = Exact<{
  input: CreateAgendaInput;
}>;


export type CreateAgendaMutation = { __typename?: 'Mutation', createAgenda: { __typename?: 'CreateAgendaOutput', ok: boolean, error?: string | null, result?: (
      { __typename?: 'Agenda' }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    ) | null } };

export type DeleteAgendaMutationVariables = Exact<{
  input: DeleteAgendaInput;
}>;


export type DeleteAgendaMutation = { __typename?: 'Mutation', deleteAgenda: { __typename?: 'DeleteAgendaOutput', ok: boolean, error?: string | null } };

export type GetAgendaAndCommentsQueryVariables = Exact<{
  commentsInput: GetCommentsByAgendaInput;
  agendaInput: FindAgendaByIdInput;
}>;


export type GetAgendaAndCommentsQuery = { __typename?: 'Query', getCommentsByAgenda: { __typename?: 'GetCommentsByAgendaOutput', ok: boolean, error?: string | null, totalPage?: number | null, comments?: Array<(
      { __typename?: 'Comments' }
      & { ' $fragmentRefs'?: { 'CommentPartsFragment': CommentPartsFragment } }
    )> | null }, findAgendaById: { __typename?: 'FindAgendaByIdOutput', ok: boolean, error?: string | null, agenda?: (
      { __typename?: 'Agenda', author?: { __typename?: 'User', id: number, name: string } | null }
      & { ' $fragmentRefs'?: { 'AgendaDetailPartsFragment': AgendaDetailPartsFragment } }
    ) | null } };

export type VoteOrUnvoteMutationVariables = Exact<{
  input: VoteOrUnvoteInput;
}>;


export type VoteOrUnvoteMutation = { __typename?: 'Mutation', voteOrUnvote: { __typename?: 'VoteOrUnvoteOutput', ok: boolean, error?: string | null, voteCount?: number | null, message?: string | null, voteId?: number | null } };

export type CreateCommentsMutationVariables = Exact<{
  input: CreateCommentsInput;
}>;


export type CreateCommentsMutation = { __typename?: 'Mutation', createComments: { __typename?: 'CreateCommentsOutput', ok: boolean, error?: string | null, comments?: (
      { __typename?: 'Comments' }
      & { ' $fragmentRefs'?: { 'CommentPartsFragment': CommentPartsFragment } }
    ) | null } };

export type DeleteCommentsMutationVariables = Exact<{
  input: DeleteCommentsInput;
}>;


export type DeleteCommentsMutation = { __typename?: 'Mutation', deleteComments: { __typename?: 'DeleteCommentsOutput', ok: boolean, error?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, email: string, name: string, role: UserRole } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', error?: string | null, ok: boolean, accessToken?: string | null, refreshTokenId?: number | null } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'CommonOutput', ok: boolean, error?: string | null } };

export const VotedOpFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"votedOp"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Opinion"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"votedUserCount"}}]}}]} as unknown as DocumentNode<VotedOpFragment, unknown>;
export const AgendaPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgendaParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agenda"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"seriousness"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"opinions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"opinionText"}},{"kind":"Field","name":{"kind":"Name","value":"votedUserCount"}}]}}]}}]} as unknown as DocumentNode<AgendaPartsFragment, unknown>;
export const AgendaDetailPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgendaDetailParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agenda"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"seriousness"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"opinions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"opinionText"}},{"kind":"Field","name":{"kind":"Name","value":"votedUserCount"}},{"kind":"Field","name":{"kind":"Name","value":"votedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"birth"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}}]}}]}}]}}]} as unknown as DocumentNode<AgendaDetailPartsFragment, unknown>;
export const CommentPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comments"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bundleId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CommentPartsFragment, unknown>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"newAccessToken"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const GetAllAgendasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllAgendas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAllAgendasInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllAgendas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"agendas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAllAgendasQuery, GetAllAgendasQueryVariables>;
export const GetAgendasByCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAgendasByCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAgendasByCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAgendasByCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"agendas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAgendasByCategoryQuery, GetAgendasByCategoryQueryVariables>;
export const CreateAgendaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAgenda"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAgendaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAgenda"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<CreateAgendaMutation, CreateAgendaMutationVariables>;
export const DeleteAgendaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAgenda"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteAgendaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAgenda"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<DeleteAgendaMutation, DeleteAgendaMutationVariables>;
export const GetAgendaAndCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAgendaAndComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentsInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetCommentsByAgendaInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agendaInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FindAgendaByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCommentsByAgenda"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentParts"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"findAgendaById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agendaInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"agenda"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaDetailParts"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},...CommentPartsFragmentDoc.definitions,...AgendaDetailPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAgendaAndCommentsQuery, GetAgendaAndCommentsQueryVariables>;
export const VoteOrUnvoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"voteOrUnvote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteOrUnvoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voteOrUnvote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"voteId"}}]}}]}}]} as unknown as DocumentNode<VoteOrUnvoteMutation, VoteOrUnvoteMutationVariables>;
export const CreateCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentParts"}}]}}]}}]}},...CommentPartsFragmentDoc.definitions]} as unknown as DocumentNode<CreateCommentsMutation, CreateCommentsMutationVariables>;
export const DeleteCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCommentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<DeleteCommentsMutation, DeleteCommentsMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshTokenId"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;