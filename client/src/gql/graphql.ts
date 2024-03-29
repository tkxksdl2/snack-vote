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

export type AddIssueContentInput = {
  content: Scalars['String'];
  issueId: Scalars['Int'];
};

export type AddIssueContentOutput = {
  __typename?: 'AddIssueContentOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  result?: Maybe<IssueContent>;
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

export type AgendaChartStats = {
  __typename?: 'AgendaChartStats';
  ageData: Array<Scalars['Int']>;
  sexData: Array<Scalars['Int']>;
};

export type AgendaDetailSummary = {
  __typename?: 'AgendaDetailSummary';
  agenda: Agenda;
  agendaChartStatsArr: Array<AgendaChartStats>;
};

export enum Category {
  Culture = 'Culture',
  Game = 'Game',
  Humor = 'Humor',
  Social = 'Social'
}

export type Comments = {
  __typename?: 'Comments';
  agenda?: Maybe<Agenda>;
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

export type CreateIssueInput = {
  content: Scalars['String'];
  subject: Scalars['String'];
};

export type CreateIssueOutput = {
  __typename?: 'CreateIssueOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  result?: Maybe<Issue>;
};

export type CreateUserInput = {
  birth: Scalars['DateTime'];
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  role: UserRole;
  sex: Sex;
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

export type DeleteIssueContentInput = {
  issueContentId: Scalars['Int'];
};

export type DeleteIssueContentOutput = {
  __typename?: 'DeleteIssueContentOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type DeleteIssueInput = {
  issueId: Scalars['Int'];
};

export type DeleteIssueOutput = {
  __typename?: 'DeleteIssueOutput';
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

export type GetAgendaAndStatsByIdInput = {
  id: Scalars['Float'];
  userId?: InputMaybe<Scalars['Int']>;
};

export type GetAgendaAndStatsByIdOutput = {
  __typename?: 'GetAgendaAndStatsByIdOutput';
  agendaDetail?: Maybe<AgendaDetailSummary>;
  error?: Maybe<Scalars['String']>;
  isUserVotedOpinion?: Maybe<Array<Scalars['Boolean']>>;
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

export type GetAllIssuesInput = {
  page?: InputMaybe<Scalars['Int']>;
};

export type GetAllIssuesOutput = {
  __typename?: 'GetAllIssuesOutput';
  error?: Maybe<Scalars['String']>;
  issues?: Maybe<Array<Issue>>;
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

export type GetIssueAndContentsByIdInput = {
  issueId: Scalars['Int'];
};

export type GetIssueAndContentsByIdOutput = {
  __typename?: 'GetIssueAndContentsByIdOutput';
  error?: Maybe<Scalars['String']>;
  issue?: Maybe<Issue>;
  ok: Scalars['Boolean'];
};

export type GetMyAgendasInput = {
  page?: InputMaybe<Scalars['Int']>;
};

export type GetMyCommentsInput = {
  page?: InputMaybe<Scalars['Int']>;
};

export type GetMyCommentsOutput = {
  __typename?: 'GetMyCommentsOutput';
  comments?: Maybe<Array<Comments>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
};

export type GetVotedOpinionsInput = {
  page?: InputMaybe<Scalars['Int']>;
};

export type GetVotedOpinionsOutput = {
  __typename?: 'GetVotedOpinionsOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  opinions?: Maybe<Array<Opinion>>;
  totalPage?: Maybe<Scalars['Int']>;
};

export type GetmyAgendasOutput = {
  __typename?: 'GetmyAgendasOutput';
  agendas?: Maybe<Array<Agenda>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
};

export type GoogleLoginInput = {
  token: Scalars['String'];
};

export type GoogleLoginOutput = {
  __typename?: 'GoogleLoginOutput';
  accessToken?: Maybe<Scalars['String']>;
  createRequired?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  userId?: Maybe<Scalars['Int']>;
};

export type Issue = {
  __typename?: 'Issue';
  author?: Maybe<User>;
  contentCount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  hasAnswer: Scalars['Boolean'];
  id: Scalars['Float'];
  issueContents?: Maybe<Array<IssueContent>>;
  subject: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type IssueContent = {
  __typename?: 'IssueContent';
  author?: Maybe<User>;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  issue: Issue;
  updatedAt: Scalars['DateTime'];
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
  userId?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addIssueContent: AddIssueContentOutput;
  createAgenda: CreateAgendaOutput;
  createComments: CreateCommentsOutput;
  createIssue: CreateIssueOutput;
  createUser: CommonOutput;
  deleteAgenda: DeleteAgendaOutput;
  deleteComments: DeleteCommentsOutput;
  deleteIssue: DeleteIssueOutput;
  deleteIssueContent: DeleteIssueContentOutput;
  deleteUser: DeleteUserOutput;
  googleLogin: GoogleLoginOutput;
  login: LoginOutput;
  refresh: RefreshOutput;
  updateIssueContent: UpdateIssueContentOutput;
  updateUser: UpdateUserOutput;
  voteOrUnvote: VoteOrUnvoteOutput;
};


export type MutationAddIssueContentArgs = {
  input: AddIssueContentInput;
};


export type MutationCreateAgendaArgs = {
  input: CreateAgendaInput;
};


export type MutationCreateCommentsArgs = {
  input: CreateCommentsInput;
};


export type MutationCreateIssueArgs = {
  input: CreateIssueInput;
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


export type MutationDeleteIssueArgs = {
  input: DeleteIssueInput;
};


export type MutationDeleteIssueContentArgs = {
  input: DeleteIssueContentInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationGoogleLoginArgs = {
  input: GoogleLoginInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshArgs = {
  input: RefreshInput;
};


export type MutationUpdateIssueContentArgs = {
  input: UpdateIssueContentInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationVoteOrUnvoteArgs = {
  input: VoteOrUnvoteInput;
};

export type Opinion = {
  __typename?: 'Opinion';
  agenda?: Maybe<Agenda>;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['Float'];
  opinionText: Scalars['String'];
  opinionType: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  vote: Array<Vote>;
  votedUserCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  findAgendaById: FindAgendaByIdOutput;
  getAgendaAndStatsById: GetAgendaAndStatsByIdOutput;
  getAllAgendas: GetAllAgendasOutput;
  getAllIssues: GetAllIssuesOutput;
  getCommentsByAgenda: GetCommentsByAgendaOutput;
  getIssueAndContentsById: GetIssueAndContentsByIdOutput;
  getMostVotedAgendasValue: Array<Agenda>;
  getMyAgendas: GetmyAgendasOutput;
  getMyComments: GetMyCommentsOutput;
  getVotedOpinions: GetVotedOpinionsOutput;
  me: User;
  searchAgendasByCategory: SearchAgendasByCategoryOutput;
};


export type QueryFindAgendaByIdArgs = {
  input: FindAgendaByIdInput;
};


export type QueryGetAgendaAndStatsByIdArgs = {
  input: GetAgendaAndStatsByIdInput;
};


export type QueryGetAllAgendasArgs = {
  input: GetAllAgendasInput;
};


export type QueryGetAllIssuesArgs = {
  input: GetAllIssuesInput;
};


export type QueryGetCommentsByAgendaArgs = {
  input: GetCommentsByAgendaInput;
};


export type QueryGetIssueAndContentsByIdArgs = {
  input: GetIssueAndContentsByIdInput;
};


export type QueryGetMyAgendasArgs = {
  input: GetMyAgendasInput;
};


export type QueryGetMyCommentsArgs = {
  input: GetMyCommentsInput;
};


export type QueryGetVotedOpinionsArgs = {
  input: GetVotedOpinionsInput;
};


export type QuerySearchAgendasByCategoryArgs = {
  input: SearchAgendasByCategoryInput;
};

export type RefreshInput = {
  accessToken: Scalars['String'];
  userId: Scalars['Int'];
};

export type RefreshOutput = {
  __typename?: 'RefreshOutput';
  error?: Maybe<Scalars['String']>;
  newAccessToken?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
};

export type SearchAgendasByCategoryInput = {
  category: Category;
  page?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
};

export type SearchAgendasByCategoryOutput = {
  __typename?: 'SearchAgendasByCategoryOutput';
  agendas?: Maybe<Array<Agenda>>;
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  totalPage?: Maybe<Scalars['Int']>;
};

export enum Sex {
  Female = 'Female',
  Male = 'Male'
}

export type UpdateIssueContentInput = {
  content: Scalars['String'];
  issueContentId: Scalars['Int'];
};

export type UpdateIssueContentOutput = {
  __typename?: 'UpdateIssueContentOutput';
  error?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  result?: Maybe<IssueContent>;
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
  birth: Scalars['DateTime'];
  comments: Array<Comments>;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  id: Scalars['Float'];
  issueContents: Array<Issue>;
  issues: Array<Issue>;
  name: Scalars['String'];
  password: Scalars['String'];
  profileImage?: Maybe<Scalars['String']>;
  role: UserRole;
  sex: Sex;
  updatedAt: Scalars['DateTime'];
  vote: Array<Vote>;
};

export enum UserRole {
  Admin = 'Admin',
  Client = 'Client'
}

export type Vote = {
  __typename?: 'Vote';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  opinion: Opinion;
  user: User;
};

export type VoteOrUnvoteInput = {
  agendaId: Scalars['Int'];
  otherOpinionId: Scalars['Int'];
  voteOpinionId: Scalars['Int'];
};

export type VoteOrUnvoteOutput = {
  __typename?: 'VoteOrUnvoteOutput';
  error?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  ok: Scalars['Boolean'];
  opinionId?: Maybe<Scalars['Int']>;
  opinionType?: Maybe<Scalars['Boolean']>;
  resultType?: Maybe<Scalars['String']>;
  voteCount?: Maybe<Scalars['Int']>;
  voteId?: Maybe<Scalars['String']>;
};

export type RefreshMutationVariables = Exact<{
  input: RefreshInput;
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: { __typename?: 'RefreshOutput', ok: boolean, error?: string | null, newAccessToken?: string | null } };

export type MeFragment = { __typename?: 'User', name: string } & { ' $fragmentName'?: 'MeFragment' };

export type AgendaPartsFragment = { __typename?: 'Agenda', id: number, subject: string, seriousness: number, category: Category, createdAt: any, opinions: Array<{ __typename?: 'Opinion', id: number, opinionText: string, votedUserCount: number }>, author?: { __typename?: 'User', id: number, name: string } | null } & { ' $fragmentName'?: 'AgendaPartsFragment' };

export type CommentPartsFragment = { __typename?: 'Comments', id: number, bundleId: number, content: string, createdAt: any, deletedAt?: any | null, depth: number, author?: { __typename?: 'User', id: number, name: string } | null } & { ' $fragmentName'?: 'CommentPartsFragment' };

export type IssuePartsFragment = { __typename?: 'Issue', id: number, subject: string, hasAnswer: boolean, createdAt: any, contentCount: number, author?: { __typename?: 'User', id: number, name: string } | null } & { ' $fragmentName'?: 'IssuePartsFragment' };

export type IssueContentPartsFragment = { __typename?: 'IssueContent', id: number, content: string, createdAt: any, updatedAt: any, deletedAt?: any | null, author?: { __typename?: 'User', id: number, name: string } | null } & { ' $fragmentName'?: 'IssueContentPartsFragment' };

export type CreateIssueMutationVariables = Exact<{
  input: CreateIssueInput;
}>;


export type CreateIssueMutation = { __typename?: 'Mutation', createIssue: { __typename?: 'CreateIssueOutput', ok: boolean, error?: string | null, result?: { __typename?: 'Issue', id: number, createdAt: any, subject: string, issueContents?: Array<{ __typename?: 'IssueContent', content: string }> | null } | null } };

export type GetAllIssuesQueryVariables = Exact<{
  input: GetAllIssuesInput;
}>;


export type GetAllIssuesQuery = { __typename?: 'Query', getAllIssues: { __typename?: 'GetAllIssuesOutput', ok: boolean, error?: string | null, totalPage?: number | null, issues?: Array<(
      { __typename?: 'Issue' }
      & { ' $fragmentRefs'?: { 'IssuePartsFragment': IssuePartsFragment } }
    )> | null } };

export type GetIssueAndContentsByIdQueryVariables = Exact<{
  input: GetIssueAndContentsByIdInput;
}>;


export type GetIssueAndContentsByIdQuery = { __typename?: 'Query', getIssueAndContentsById: { __typename?: 'GetIssueAndContentsByIdOutput', ok: boolean, error?: string | null, issue?: { __typename?: 'Issue', subject: string, contentCount: number, hasAnswer: boolean, createdAt: any, author?: { __typename?: 'User', id: number, name: string } | null, issueContents?: Array<(
        { __typename?: 'IssueContent' }
        & { ' $fragmentRefs'?: { 'IssueContentPartsFragment': IssueContentPartsFragment } }
      )> | null } | null } };

export type DeleteIssueMutationVariables = Exact<{
  input: DeleteIssueInput;
}>;


export type DeleteIssueMutation = { __typename?: 'Mutation', deleteIssue: { __typename?: 'DeleteIssueOutput', ok: boolean, error?: string | null } };

export type GetAllAgendasQueryVariables = Exact<{
  input: GetAllAgendasInput;
}>;


export type GetAllAgendasQuery = { __typename?: 'Query', getAllAgendas: { __typename?: 'GetAllAgendasOutput', ok: boolean, error?: string | null, totalPage?: number | null, agendas?: Array<(
      { __typename?: 'Agenda' }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    )> | null } };

export type SearchAgendasByCategoryQueryVariables = Exact<{
  input: SearchAgendasByCategoryInput;
}>;


export type SearchAgendasByCategoryQuery = { __typename?: 'Query', searchAgendasByCategory: { __typename?: 'SearchAgendasByCategoryOutput', ok: boolean, error?: string | null, totalPage?: number | null, agendas?: Array<(
      { __typename?: 'Agenda' }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    )> | null } };

export type GetMostVotedAgendasValueQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMostVotedAgendasValueQuery = { __typename?: 'Query', getMostVotedAgendasValue: Array<(
    { __typename?: 'Agenda' }
    & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
  )> };

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

export type GetMyAgendasQueryVariables = Exact<{
  input: GetMyAgendasInput;
}>;


export type GetMyAgendasQuery = { __typename?: 'Query', getMyAgendas: { __typename?: 'GetmyAgendasOutput', ok: boolean, error?: string | null, totalPage?: number | null, agendas?: Array<(
      { __typename?: 'Agenda' }
      & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
    )> | null } };

export type GetVotedOpinionsQueryVariables = Exact<{
  input: GetVotedOpinionsInput;
}>;


export type GetVotedOpinionsQuery = { __typename?: 'Query', getVotedOpinions: { __typename?: 'GetVotedOpinionsOutput', ok: boolean, error?: string | null, totalPage?: number | null, opinions?: Array<{ __typename?: 'Opinion', id: number, opinionText: string, votedUserCount: number, agenda?: { __typename?: 'Agenda', id: number, subject: string, createdAt: any } | null }> | null } };

export type GetAgendaAndCommentsQueryVariables = Exact<{
  commentsInput: GetCommentsByAgendaInput;
  agendaInput: GetAgendaAndStatsByIdInput;
}>;


export type GetAgendaAndCommentsQuery = { __typename?: 'Query', getCommentsByAgenda: { __typename?: 'GetCommentsByAgendaOutput', ok: boolean, error?: string | null, totalPage?: number | null, comments?: Array<(
      { __typename?: 'Comments' }
      & { ' $fragmentRefs'?: { 'CommentPartsFragment': CommentPartsFragment } }
    )> | null }, getAgendaAndStatsById: { __typename?: 'GetAgendaAndStatsByIdOutput', ok: boolean, error?: string | null, isUserVotedOpinion?: Array<boolean> | null, agendaDetail?: { __typename?: 'AgendaDetailSummary', agenda: (
        { __typename?: 'Agenda' }
        & { ' $fragmentRefs'?: { 'AgendaPartsFragment': AgendaPartsFragment } }
      ), agendaChartStatsArr: Array<{ __typename?: 'AgendaChartStats', sexData: Array<number>, ageData: Array<number> }> } | null } };

export type VoteOrUnvoteMutationVariables = Exact<{
  input: VoteOrUnvoteInput;
}>;


export type VoteOrUnvoteMutation = { __typename?: 'Mutation', voteOrUnvote: { __typename?: 'VoteOrUnvoteOutput', ok: boolean, error?: string | null, voteCount?: number | null, message?: string | null, opinionId?: number | null, voteId?: string | null, resultType?: string | null, opinionType?: boolean | null } };

export type CreateCommentsMutationVariables = Exact<{
  input: CreateCommentsInput;
}>;


export type CreateCommentsMutation = { __typename?: 'Mutation', createComments: { __typename?: 'CreateCommentsOutput', ok: boolean, error?: string | null, comments?: (
      { __typename?: 'Comments' }
      & { ' $fragmentRefs'?: { 'CommentPartsFragment': CommentPartsFragment } }
    ) | null } };

export type GetMyCommentsQueryVariables = Exact<{
  input: GetMyCommentsInput;
}>;


export type GetMyCommentsQuery = { __typename?: 'Query', getMyComments: { __typename?: 'GetMyCommentsOutput', ok: boolean, error?: string | null, totalPage?: number | null, comments?: Array<{ __typename?: 'Comments', createdAt: any, content: string, author?: { __typename?: 'User', id: number } | null, agenda?: { __typename?: 'Agenda', id: number, subject: string } | null }> | null } };

export type DeleteCommentsMutationVariables = Exact<{
  input: DeleteCommentsInput;
}>;


export type DeleteCommentsMutation = { __typename?: 'Mutation', deleteComments: { __typename?: 'DeleteCommentsOutput', ok: boolean, error?: string | null } };

export type AddIssueContentMutationVariables = Exact<{
  input: AddIssueContentInput;
}>;


export type AddIssueContentMutation = { __typename?: 'Mutation', addIssueContent: { __typename?: 'AddIssueContentOutput', ok: boolean, result?: { __typename?: 'IssueContent', content: string } | null } };

export type UpdateIssueContentMutationVariables = Exact<{
  input: UpdateIssueContentInput;
}>;


export type UpdateIssueContentMutation = { __typename?: 'Mutation', updateIssueContent: { __typename?: 'UpdateIssueContentOutput', ok: boolean, error?: string | null, result?: { __typename?: 'IssueContent', id: number, content: string } | null } };

export type DeleteIssuecontentMutationVariables = Exact<{
  input: DeleteIssueContentInput;
}>;


export type DeleteIssuecontentMutation = { __typename?: 'Mutation', deleteIssueContent: { __typename?: 'DeleteIssueContentOutput', ok: boolean, error?: string | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, email: string, name: string, role: UserRole, sex: Sex, birth: any } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', error?: string | null, ok: boolean, accessToken?: string | null, userId?: number | null } };

export type GoogleLoginMutationVariables = Exact<{
  input: GoogleLoginInput;
}>;


export type GoogleLoginMutation = { __typename?: 'Mutation', googleLogin: { __typename?: 'GoogleLoginOutput', error?: string | null, ok: boolean, accessToken?: string | null, userId?: number | null, createRequired?: boolean | null, email?: string | null } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'CommonOutput', ok: boolean, error?: string | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserOutput', ok: boolean, error?: string | null } };

export const MeFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Me"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<MeFragment, unknown>;
export const AgendaPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AgendaParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Agenda"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"seriousness"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"opinions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"opinionText"}},{"kind":"Field","name":{"kind":"Name","value":"votedUserCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AgendaPartsFragment, unknown>;
export const CommentPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CommentParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Comments"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bundleId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CommentPartsFragment, unknown>;
export const IssuePartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Issue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"hasAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"contentCount"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<IssuePartsFragment, unknown>;
export const IssueContentPartsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IssueContentParts"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IssueContent"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<IssueContentPartsFragment, unknown>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"newAccessToken"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const CreateIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateIssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"issueContents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateIssueMutation, CreateIssueMutationVariables>;
export const GetAllIssuesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllIssues"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAllIssuesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllIssues"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"issues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueParts"}}]}}]}}]}},...IssuePartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAllIssuesQuery, GetAllIssuesQueryVariables>;
export const GetIssueAndContentsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIssueAndContentsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetIssueAndContentsByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getIssueAndContentsById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"issue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"contentCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"issueContents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IssueContentParts"}}]}}]}}]}}]}},...IssueContentPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetIssueAndContentsByIdQuery, GetIssueAndContentsByIdQueryVariables>;
export const DeleteIssueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteIssue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteIssueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<DeleteIssueMutation, DeleteIssueMutationVariables>;
export const GetAllAgendasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllAgendas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAllAgendasInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllAgendas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"agendas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAllAgendasQuery, GetAllAgendasQueryVariables>;
export const SearchAgendasByCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"searchAgendasByCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchAgendasByCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchAgendasByCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"agendas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<SearchAgendasByCategoryQuery, SearchAgendasByCategoryQueryVariables>;
export const GetMostVotedAgendasValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMostVotedAgendasValue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMostVotedAgendasValue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetMostVotedAgendasValueQuery, GetMostVotedAgendasValueQueryVariables>;
export const CreateAgendaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAgenda"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAgendaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAgenda"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<CreateAgendaMutation, CreateAgendaMutationVariables>;
export const DeleteAgendaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteAgenda"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteAgendaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAgenda"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<DeleteAgendaMutation, DeleteAgendaMutationVariables>;
export const GetMyAgendasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMyAgendas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMyAgendasInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyAgendas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"agendas"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}}]}}]}},...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetMyAgendasQuery, GetMyAgendasQueryVariables>;
export const GetVotedOpinionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVotedOpinions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetVotedOpinionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVotedOpinions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"opinions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"opinionText"}},{"kind":"Field","name":{"kind":"Name","value":"votedUserCount"}},{"kind":"Field","name":{"kind":"Name","value":"agenda"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetVotedOpinionsQuery, GetVotedOpinionsQueryVariables>;
export const GetAgendaAndCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAgendaAndComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"commentsInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetCommentsByAgendaInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agendaInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAgendaAndStatsByIdInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCommentsByAgenda"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"commentsInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentParts"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAgendaAndStatsById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agendaInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"agendaDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"agenda"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AgendaParts"}}]}},{"kind":"Field","name":{"kind":"Name","value":"agendaChartStatsArr"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sexData"}},{"kind":"Field","name":{"kind":"Name","value":"ageData"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isUserVotedOpinion"}}]}}]}},...CommentPartsFragmentDoc.definitions,...AgendaPartsFragmentDoc.definitions]} as unknown as DocumentNode<GetAgendaAndCommentsQuery, GetAgendaAndCommentsQueryVariables>;
export const VoteOrUnvoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"voteOrUnvote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteOrUnvoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voteOrUnvote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"voteCount"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"opinionId"}},{"kind":"Field","name":{"kind":"Name","value":"voteId"}},{"kind":"Field","name":{"kind":"Name","value":"resultType"}},{"kind":"Field","name":{"kind":"Name","value":"opinionType"}}]}}]}}]} as unknown as DocumentNode<VoteOrUnvoteMutation, VoteOrUnvoteMutationVariables>;
export const CreateCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CommentParts"}}]}}]}}]}},...CommentPartsFragmentDoc.definitions]} as unknown as DocumentNode<CreateCommentsMutation, CreateCommentsMutationVariables>;
export const GetMyCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMyComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetMyCommentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"totalPage"}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"agenda"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMyCommentsQuery, GetMyCommentsQueryVariables>;
export const DeleteCommentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteComments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteCommentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteComments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<DeleteCommentsMutation, DeleteCommentsMutationVariables>;
export const AddIssueContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addIssueContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddIssueContentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addIssueContent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<AddIssueContentMutation, AddIssueContentMutationVariables>;
export const UpdateIssueContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateIssueContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIssueContentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIssueContent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"result"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateIssueContentMutation, UpdateIssueContentMutationVariables>;
export const DeleteIssuecontentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteIssuecontent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteIssueContentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIssueContent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<DeleteIssuecontentMutation, DeleteIssuecontentMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"sex"}},{"kind":"Field","name":{"kind":"Name","value":"birth"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const GoogleLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"googleLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GoogleLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"googleLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createRequired"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;