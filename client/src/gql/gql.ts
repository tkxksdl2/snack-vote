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
    "\n          fragment Me on User {\n            name\n          }\n        ": types.MeFragmentDoc,
    "\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    category\n    createdAt\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n    author {\n      id\n      name\n    }\n  }\n": types.AgendaPartsFragmentDoc,
    "\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      id\n      name\n    }\n  }\n": types.CommentPartsFragmentDoc,
    "\n  fragment IssueParts on Issue {\n    id\n    subject\n    hasAnswer\n    createdAt\n    contentCount\n    author {\n      id\n      name\n    }\n  }\n": types.IssuePartsFragmentDoc,
    "\n  fragment IssueContentParts on IssueContent {\n    id\n    content\n    createdAt\n    updatedAt\n    deletedAt\n    author {\n      id\n      name\n    }\n  }\n": types.IssueContentPartsFragmentDoc,
    "\n  mutation createIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      ok\n      error\n      result {\n        id\n        createdAt\n        subject\n        issueContents {\n          content\n        }\n      }\n    }\n  }\n": types.CreateIssueDocument,
    "\n  query getAllIssues($input: GetAllIssuesInput!) {\n    getAllIssues(input: $input) {\n      ok\n      error\n      totalPage\n      issues {\n        ...IssueParts\n      }\n    }\n  }\n  \n": types.GetAllIssuesDocument,
    "\n  query getIssueAndContentsById($input: GetIssueAndContentsByIdInput!) {\n    getIssueAndContentsById(input: $input) {\n      ok\n      error\n      issue {\n        subject\n        contentCount\n        hasAnswer\n        createdAt\n        author {\n          id\n          name\n        }\n        issueContents {\n          ...IssueContentParts\n        }\n      }\n    }\n  }\n  \n": types.GetIssueAndContentsByIdDocument,
    "\n  mutation deleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      ok\n      error\n    }\n  }\n": types.DeleteIssueDocument,
    "\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.GetAllAgendasDocument,
    "\n  query searchAgendasByCategory($input: SearchAgendasByCategoryInput!) {\n    searchAgendasByCategory(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.SearchAgendasByCategoryDocument,
    "\n  query getMostVotedAgendasValue {\n    getMostVotedAgendasValue {\n      ...AgendaParts\n    }\n  }\n  \n": types.GetMostVotedAgendasValueDocument,
    "\n  mutation createAgenda($input: CreateAgendaInput!) {\n    createAgenda(input: $input) {\n      ok\n      error\n      result {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.CreateAgendaDocument,
    "\n  mutation deleteAgenda($input: DeleteAgendaInput!) {\n    deleteAgenda(input: $input) {\n      ok\n      error\n    }\n  }\n": types.DeleteAgendaDocument,
    "\n  query getMyAgendas($input: GetMyAgendasInput!) {\n    getMyAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n": types.GetMyAgendasDocument,
    "\n  query getVotedOpinions($input: GetVotedOpinionsInput!) {\n    getVotedOpinions(input: $input) {\n      ok\n      error\n      totalPage\n      opinions {\n        id\n        opinionText\n        votedUserCount\n        agenda {\n          id\n          subject\n          createdAt\n        }\n      }\n    }\n  }\n": types.GetVotedOpinionsDocument,
    "\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: GetAgendaAndStatsByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    getAgendaAndStatsById(input: $agendaInput) {\n      ok\n      error\n      agendaDetail {\n        agenda {\n          ...AgendaParts\n        }\n        agendaChartStatsArr {\n          sexData\n          ageData\n        }\n      }\n      isUserVotedOpinion\n    }\n  }\n  \n  \n": types.GetAgendaAndCommentsDocument,
    "\n  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {\n    voteOrUnvote(input: $input) {\n      ok\n      error\n      voteCount\n      message\n      opinionId\n      voteId\n      resultType\n      opinionType\n    }\n  }\n": types.VoteOrUnvoteDocument,
    "\n  mutation createComments($input: CreateCommentsInput!) {\n    createComments(input: $input) {\n      ok\n      error\n      comments {\n        ...CommentParts\n      }\n    }\n  }\n  \n": types.CreateCommentsDocument,
    "\n  query getMyComments($input: GetMyCommentsInput!) {\n    getMyComments(input: $input) {\n      ok\n      error\n      totalPage\n      comments {\n        createdAt\n        content\n        author {\n          id\n        }\n        agenda {\n          id\n          subject\n        }\n      }\n    }\n  }\n": types.GetMyCommentsDocument,
    "\n  mutation deleteComments($input: DeleteCommentsInput!) {\n    deleteComments(input: $input) {\n      ok\n      error\n    }\n  }\n": types.DeleteCommentsDocument,
    "\n  mutation addIssueContent($input: AddIssueContentInput!) {\n    addIssueContent(input: $input) {\n      ok\n      result {\n        content\n      }\n    }\n  }\n": types.AddIssueContentDocument,
    "\n  mutation updateIssueContent($input: UpdateIssueContentInput!) {\n    updateIssueContent(input: $input) {\n      ok\n      error\n      result {\n        id\n        content\n      }\n    }\n  }\n": types.UpdateIssueContentDocument,
    "\n  mutation deleteIssuecontent($input: DeleteIssueContentInput!) {\n    deleteIssueContent(input: $input) {\n      ok\n      error\n    }\n  }\n": types.DeleteIssuecontentDocument,
    "\n  query me {\n    me {\n      id\n      email\n      name\n      role\n      sex\n      birth\n    }\n  }\n": types.MeDocument,
    "\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      error\n      ok\n      accessToken\n      userId\n    }\n  }\n": types.LoginDocument,
    "\n  mutation googleLogin($input: GoogleLoginInput!) {\n    googleLogin(input: $input) {\n      error\n      ok\n      accessToken\n      userId\n      createRequired\n      email\n    }\n  }\n": types.GoogleLoginDocument,
    "\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      ok\n      error\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation updateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      ok\n      error\n    }\n  }\n": types.UpdateUserDocument,
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
export function graphql(source: "\n          fragment Me on User {\n            name\n          }\n        "): (typeof documents)["\n          fragment Me on User {\n            name\n          }\n        "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    category\n    createdAt\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n    author {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment AgendaParts on Agenda {\n    id\n    subject\n    seriousness\n    category\n    createdAt\n    opinions {\n      id\n      opinionText\n      votedUserCount\n    }\n    author {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment CommentParts on Comments {\n    id\n    bundleId\n    content\n    createdAt\n    deletedAt\n    depth\n    author {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment IssueParts on Issue {\n    id\n    subject\n    hasAnswer\n    createdAt\n    contentCount\n    author {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment IssueParts on Issue {\n    id\n    subject\n    hasAnswer\n    createdAt\n    contentCount\n    author {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment IssueContentParts on IssueContent {\n    id\n    content\n    createdAt\n    updatedAt\n    deletedAt\n    author {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment IssueContentParts on IssueContent {\n    id\n    content\n    createdAt\n    updatedAt\n    deletedAt\n    author {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      ok\n      error\n      result {\n        id\n        createdAt\n        subject\n        issueContents {\n          content\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation createIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      ok\n      error\n      result {\n        id\n        createdAt\n        subject\n        issueContents {\n          content\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllIssues($input: GetAllIssuesInput!) {\n    getAllIssues(input: $input) {\n      ok\n      error\n      totalPage\n      issues {\n        ...IssueParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getAllIssues($input: GetAllIssuesInput!) {\n    getAllIssues(input: $input) {\n      ok\n      error\n      totalPage\n      issues {\n        ...IssueParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getIssueAndContentsById($input: GetIssueAndContentsByIdInput!) {\n    getIssueAndContentsById(input: $input) {\n      ok\n      error\n      issue {\n        subject\n        contentCount\n        hasAnswer\n        createdAt\n        author {\n          id\n          name\n        }\n        issueContents {\n          ...IssueContentParts\n        }\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getIssueAndContentsById($input: GetIssueAndContentsByIdInput!) {\n    getIssueAndContentsById(input: $input) {\n      ok\n      error\n      issue {\n        subject\n        contentCount\n        hasAnswer\n        createdAt\n        author {\n          id\n          name\n        }\n        issueContents {\n          ...IssueContentParts\n        }\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation deleteIssue($input: DeleteIssueInput!) {\n    deleteIssue(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getAllAgendas($input: GetAllAgendasInput!) {\n    getAllAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query searchAgendasByCategory($input: SearchAgendasByCategoryInput!) {\n    searchAgendasByCategory(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query searchAgendasByCategory($input: SearchAgendasByCategoryInput!) {\n    searchAgendasByCategory(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMostVotedAgendasValue {\n    getMostVotedAgendasValue {\n      ...AgendaParts\n    }\n  }\n  \n"): (typeof documents)["\n  query getMostVotedAgendasValue {\n    getMostVotedAgendasValue {\n      ...AgendaParts\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createAgenda($input: CreateAgendaInput!) {\n    createAgenda(input: $input) {\n      ok\n      error\n      result {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation createAgenda($input: CreateAgendaInput!) {\n    createAgenda(input: $input) {\n      ok\n      error\n      result {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteAgenda($input: DeleteAgendaInput!) {\n    deleteAgenda(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation deleteAgenda($input: DeleteAgendaInput!) {\n    deleteAgenda(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMyAgendas($input: GetMyAgendasInput!) {\n    getMyAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  query getMyAgendas($input: GetMyAgendasInput!) {\n    getMyAgendas(input: $input) {\n      ok\n      error\n      totalPage\n      agendas {\n        ...AgendaParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getVotedOpinions($input: GetVotedOpinionsInput!) {\n    getVotedOpinions(input: $input) {\n      ok\n      error\n      totalPage\n      opinions {\n        id\n        opinionText\n        votedUserCount\n        agenda {\n          id\n          subject\n          createdAt\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getVotedOpinions($input: GetVotedOpinionsInput!) {\n    getVotedOpinions(input: $input) {\n      ok\n      error\n      totalPage\n      opinions {\n        id\n        opinionText\n        votedUserCount\n        agenda {\n          id\n          subject\n          createdAt\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: GetAgendaAndStatsByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    getAgendaAndStatsById(input: $agendaInput) {\n      ok\n      error\n      agendaDetail {\n        agenda {\n          ...AgendaParts\n        }\n        agendaChartStatsArr {\n          sexData\n          ageData\n        }\n      }\n      isUserVotedOpinion\n    }\n  }\n  \n  \n"): (typeof documents)["\n  query getAgendaAndComments(\n    $commentsInput: GetCommentsByAgendaInput!\n    $agendaInput: GetAgendaAndStatsByIdInput!\n  ) {\n    getCommentsByAgenda(input: $commentsInput) {\n      ok\n      error\n      totalPage\n      comments {\n        ...CommentParts\n      }\n    }\n    getAgendaAndStatsById(input: $agendaInput) {\n      ok\n      error\n      agendaDetail {\n        agenda {\n          ...AgendaParts\n        }\n        agendaChartStatsArr {\n          sexData\n          ageData\n        }\n      }\n      isUserVotedOpinion\n    }\n  }\n  \n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {\n    voteOrUnvote(input: $input) {\n      ok\n      error\n      voteCount\n      message\n      opinionId\n      voteId\n      resultType\n      opinionType\n    }\n  }\n"): (typeof documents)["\n  mutation voteOrUnvote($input: VoteOrUnvoteInput!) {\n    voteOrUnvote(input: $input) {\n      ok\n      error\n      voteCount\n      message\n      opinionId\n      voteId\n      resultType\n      opinionType\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createComments($input: CreateCommentsInput!) {\n    createComments(input: $input) {\n      ok\n      error\n      comments {\n        ...CommentParts\n      }\n    }\n  }\n  \n"): (typeof documents)["\n  mutation createComments($input: CreateCommentsInput!) {\n    createComments(input: $input) {\n      ok\n      error\n      comments {\n        ...CommentParts\n      }\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getMyComments($input: GetMyCommentsInput!) {\n    getMyComments(input: $input) {\n      ok\n      error\n      totalPage\n      comments {\n        createdAt\n        content\n        author {\n          id\n        }\n        agenda {\n          id\n          subject\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query getMyComments($input: GetMyCommentsInput!) {\n    getMyComments(input: $input) {\n      ok\n      error\n      totalPage\n      comments {\n        createdAt\n        content\n        author {\n          id\n        }\n        agenda {\n          id\n          subject\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteComments($input: DeleteCommentsInput!) {\n    deleteComments(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation deleteComments($input: DeleteCommentsInput!) {\n    deleteComments(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addIssueContent($input: AddIssueContentInput!) {\n    addIssueContent(input: $input) {\n      ok\n      result {\n        content\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation addIssueContent($input: AddIssueContentInput!) {\n    addIssueContent(input: $input) {\n      ok\n      result {\n        content\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateIssueContent($input: UpdateIssueContentInput!) {\n    updateIssueContent(input: $input) {\n      ok\n      error\n      result {\n        id\n        content\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation updateIssueContent($input: UpdateIssueContentInput!) {\n    updateIssueContent(input: $input) {\n      ok\n      error\n      result {\n        id\n        content\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteIssuecontent($input: DeleteIssueContentInput!) {\n    deleteIssueContent(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation deleteIssuecontent($input: DeleteIssueContentInput!) {\n    deleteIssueContent(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query me {\n    me {\n      id\n      email\n      name\n      role\n      sex\n      birth\n    }\n  }\n"): (typeof documents)["\n  query me {\n    me {\n      id\n      email\n      name\n      role\n      sex\n      birth\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      error\n      ok\n      accessToken\n      userId\n    }\n  }\n"): (typeof documents)["\n  mutation login($input: LoginInput!) {\n    login(input: $input) {\n      error\n      ok\n      accessToken\n      userId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation googleLogin($input: GoogleLoginInput!) {\n    googleLogin(input: $input) {\n      error\n      ok\n      accessToken\n      userId\n      createRequired\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation googleLogin($input: GoogleLoginInput!) {\n    googleLogin(input: $input) {\n      error\n      ok\n      accessToken\n      userId\n      createRequired\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation updateUser($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      ok\n      error\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;