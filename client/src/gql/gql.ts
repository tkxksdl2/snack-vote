/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  mutation refresh($input: RefreshInput!) {\n    refresh(input: $input) {\n      ok\n      error\n      newAccessToken\n    }\n  }\n": types.RefreshDocument,
    "\n  query getAgendasByCategory($input: GetAgendasByCategoryInput!) {\n    getAgendasByCategory(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.GetAgendasByCategoryDocument,
    "\n  mutation createComments($input: CreateCommentsInput!) {\n    createComments(input: $input) {\n      ok\n      error\n      comments {\n        ...CommentParts\n      }\n    }\n  }\n  \n": types.CreateCommentsDocument,
    "\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      error\n      ok\n      accessToken\n      refreshTokenId\n    }\n  }\n": types.LoginDocument,
    "\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    category\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n  }\n": types.AgendaPartsFragmentDoc,
    "\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      name\n    }\n  }\n": types.CommentPartsFragmentDoc,
    "\n  query me {\n    me {\n      id\n      email\n      name\n      role\n    }\n  }\n": types.MeDocument,
    "\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.GetAllAgendasDocument,
    "\n  mutation createAgenda($input: CreateAgendaInput!) {\n    createAgenda(input: $input) {\n      ok\n      error\n      result {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.CreateAgendaDocument,
    "\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: FindAgendaByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    findAgendaById(input: $agendaInput) {\n      ok\n      error\n      agenda {\n        ...AgendaParts\n        author {\n          id\n          name\n        }\n      }\n    }\n  }\n  \n  \n": types.GetAgendaAndCommentsDocument,
    "\n  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {\n    voteOrUnvote(input: $input) {\n      ok\n      error\n      voteCount\n      message\n      voteId\n    }\n  }\n": types.VoteOrUnvoteDocument,
    "\n          fragment votedOp on Opinion {\n            votedUserCount\n          }\n        ": types.VotedOpFragmentDoc,
    "\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      ok\n      error\n    }\n  }\n": types.CreateUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation refresh($input: RefreshInput!) {\n    refresh(input: $input) {\n      ok\n      error\n      newAccessToken\n    }\n  }\n"): (typeof documents)["\n  mutation refresh($input: RefreshInput!) {\n    refresh(input: $input) {\n      ok\n      error\n      newAccessToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAgendasByCategory($input: GetAgendasByCategoryInput!) {\n    getAgendasByCategory(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getAgendasByCategory($input: GetAgendasByCategoryInput!) {\n    getAgendasByCategory(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createComments($input: CreateCommentsInput!) {\n    createComments(input: $input) {\n      ok\n      error\n      comments {\n        ...CommentParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation createComments($input: CreateCommentsInput!) {\n    createComments(input: $input) {\n      ok\n      error\n      comments {\n        ...CommentParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      error\n      ok\n      accessToken\n      refreshTokenId\n    }\n  }\n"): (typeof documents)["\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      error\n      ok\n      accessToken\n      refreshTokenId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    category\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n  }\n"): (typeof documents)["\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    category\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query me {\n    me {\n      id\n      email\n      name\n      role\n    }\n  }\n"): (typeof documents)["\n  query me {\n    me {\n      id\n      email\n      name\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createAgenda($input: CreateAgendaInput!) {\n    createAgenda(input: $input) {\n      ok\n      error\n      result {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation createAgenda($input: CreateAgendaInput!) {\n    createAgenda(input: $input) {\n      ok\n      error\n      result {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: FindAgendaByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    findAgendaById(input: $agendaInput) {\n      ok\n      error\n      agenda {\n        ...AgendaParts\n        author {\n          id\n          name\n        }\n      }\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: FindAgendaByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    findAgendaById(input: $agendaInput) {\n      ok\n      error\n      agenda {\n        ...AgendaParts\n        author {\n          id\n          name\n        }\n      }\n    }\n  }\n  \n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {\n    voteOrUnvote(input: $input) {\n      ok\n      error\n      voteCount\n      message\n      voteId\n    }\n  }\n"): (typeof documents)["\n  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {\n    voteOrUnvote(input: $input) {\n      ok\n      error\n      voteCount\n      message\n      voteId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n          fragment votedOp on Opinion {\n            votedUserCount\n          }\n        "): (typeof documents)["\n          fragment votedOp on Opinion {\n            votedUserCount\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      ok\n      error\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;