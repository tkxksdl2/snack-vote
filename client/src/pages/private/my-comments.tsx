import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/pagination";
import {
  GetMyCommentsQuery,
  GetMyCommentsQueryVariables,
} from "../../gql/graphql";
import { parseDate } from "../../hooks/parse";
import { GET_MY_COMMENTS } from "../../queries/query-comments";
import { Helmet } from "react-helmet-async";

export const MyComments = () => {
  const [page, setPage] = useState(1);
  const { data, error } = useQuery<
    GetMyCommentsQuery,
    GetMyCommentsQueryVariables
  >(GET_MY_COMMENTS, { variables: { input: { page } } });
  const comments = data?.getMyComments.comments;
  const navigate = useNavigate();
  return (
    <div className="flex h-fit justify-center bg-slate-300 ">
      <div className="max-w-4xl w-full min-h-fit h-full bg-white px-5 py-8">
        <Helmet>
          <title>SnackVote</title>
        </Helmet>
        <div className=" text-lg font-semibold text-gray-800">작성 댓글</div>
        <div className="my-comments-grid text-center border-y">
          <span>작성일자</span>
          <span>투표 제목</span>
          <span>댓글 내용</span>
        </div>
        <div className="mb-3">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => {
              if (comment.agenda)
                return (
                  <div
                    key={`comment-${index}`}
                    onClick={() => {
                      if (comment.agenda)
                        navigate(`/agenda/${comment.agenda.id}`);
                    }}
                    className="my-comments-grid py-1 border-b cursor-pointer"
                  >
                    <span>{parseDate(comment.createdAt)}</span>
                    <span className="overflow-hidden overflow-ellipsis">
                      {comment.agenda.subject}
                    </span>
                    <span className="overflow-hidden overflow-ellipsis">
                      {comment.content}
                    </span>
                  </div>
                );
            })
          ) : (
            <>작성 댓글이 없습니다.</>
          )}
        </div>
        {data?.getMyComments.totalPage ? (
          <Pagination
            page={page}
            totalPage={data.getMyComments.totalPage}
            setPage={setPage}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
