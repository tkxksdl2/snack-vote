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
    "\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n  }\n": types.AgendaPartsFragmentDoc,
    "\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      name\n    }\n  }\n": types.CommentPartsFragmentDoc,
    "\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.GetAllAgendasDocument,
    "\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: FindAgendaByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    findAgendaById(input: $agendaInput) {\n      ok\n      error\n      agenda {\n        ...AgendaParts\n        author {\n          id\n          name\n        }\n      }\n    }\n  }\n  \n  \n": types.GetAgendaAndCommentsDocument,
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
export function graphql(source: "\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n  }\n"): (typeof documents)["\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: FindAgendaByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    findAgendaById(input: $agendaInput) {\n      ok\n      error\n      agenda {\n        ...AgendaParts\n        author {\n          id\n          name\n        }\n      }\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: FindAgendaByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    findAgendaById(input: $agendaInput) {\n      ok\n      error\n      agenda {\n        ...AgendaParts\n        author {\n          id\n          name\n        }\n      }\n    }\n  }\n  \n  \n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;