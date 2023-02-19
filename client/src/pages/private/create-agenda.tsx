import { gql, useMutation } from "@apollo/client";
import { Slider } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { cache } from "../../apollo";
import { GET_AGENDA_BY_CATEGORY } from "../../components/agenda-snippets.tsx/agenda-list";
import { CATEGORY_PARSE_OBJ } from "../../constants";
import { AGENDA_FRAGMENT } from "../../fragments";
import { getFragmentData } from "../../gql";
import {
  AgendaPartsFragment,
  Category,
  CreateAgendaMutation,
  CreateAgendaMutationVariables,
} from "../../gql/graphql";

interface ICreateAgenda {
  category: Category;
}

interface IForm {
  subject: string;
  opinionA: string;
  opinionB: string;
}

const CREATE_AGENDA = gql`
  mutation createAgenda($input: CreateAgendaInput!) {
    createAgenda(input: $input) {
      ok
      error
      result {
        ...AgendaParts
      }
    }
  }
  ${AGENDA_FRAGMENT}
`;

export const CreateAgenda: React.FC<ICreateAgenda> = ({ category }) => {
  const [serious, setSerious] = useState(5);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IForm>();
  const [createAgenda, { loading, data }] = useMutation<
    CreateAgendaMutation,
    CreateAgendaMutationVariables
  >(CREATE_AGENDA, {
    onCompleted: (data) => {
      const {
        createAgenda: { ok, error },
      } = data;
      const newAgenda = getFragmentData<AgendaPartsFragment>(
        AGENDA_FRAGMENT,
        data.createAgenda.result
      );
      if (ok && newAgenda) {
        cache.updateQuery(
          {
            query: GET_AGENDA_BY_CATEGORY,
            variables: { input: { page: 1, category } },
          },
          (data) => {
            return {
              ...data,
              getAgendasByCategory: {
                ...data.getAgendasByCategory,
                agendas: [newAgenda].concat(data.getAgendasByCategory.agendas),
              },
            };
          }
        );
        alert("투표가 게시되었습니다.");
        navigate(`/agenda/${newAgenda.id}`);
      } else if (error) console.log(error);
    },
  });
  const onValid = () => {
    const { subject, opinionA, opinionB } = getValues();
    createAgenda({
      variables: {
        input: {
          subject,
          opinionA,
          opinionB,
          category,
          seriousness: serious,
        },
      },
    });
  };
  return (
    <div className="flex min-h-screen h-full justify-center bg-slate-300 ">
      <div>
        <div className="my-10 pl-11 font-bold text-4xl text-gray-800">
          {CATEGORY_PARSE_OBJ[category]}
        </div>
        <div className="max-w-4xl w-full pt-8 c-agenda-form h-fit bg-white text-lg text-gray-800 font-semibold rounded-sm">
          <form className="px-11" onSubmit={handleSubmit(onValid)}>
            {errors.subject?.message ? (
              <div className="error-div">{errors.subject.message}</div>
            ) : errors.opinionA?.message ? (
              <div className="error-div">{errors.opinionA.message}</div>
            ) : errors.opinionB?.message ? (
              <div className="error-div">{errors.opinionB.message}</div>
            ) : data?.createAgenda.error ? (
              <div className="error-div">{data?.createAgenda.error}</div>
            ) : (
              ""
            )}
            <div className="mt-2">주제</div>
            <input
              className="w-full p-1 my-2 bg-gray-200 rounded-sm font-normal"
              placeholder="주제"
              type="text"
              {...register("subject", { required: "주제를 입력해주세요" })}
            />
            <div>의견 1</div>
            <input
              className="w-full p-1 my-2 bg-orange-200 rounded-sm font-normal"
              placeholder="내용"
              type="text"
              {...register("opinionA", { required: "의견을 입력해주세요" })}
            />
            <div>의견 2</div>
            <input
              className="w-full p-1 my-2 bg-blue-200 rounded-sm font-normal"
              placeholder="내용"
              type="text"
              {...register("opinionB", { required: "의견을 입력해주세요" })}
            />
            <div>심각도</div>
            <div className=" font-normal text-sm text-gray-500 mb-1">
              <div>
                심각도는 주제와 상관없이 작성자가 이 주제를 얼마나 중요하게
                생각하는지를 말하며 0부터 10까지 점수를 줄 수 있습니다.
              </div>
              <div>
                0에 가까울수록 가벼운 농담과 같은 주제라면, 10에 가까울수록 많은
                사람에게 영향을 끼치는 중요한 주제일 수 있습니다.
              </div>
            </div>
            <Slider
              aria-label="Seriousness"
              step={1}
              value={serious}
              onChange={(event, value) => {
                if (typeof value === "number") setSerious(value);
              }}
              valueLabelDisplay="auto"
              marks
              min={0}
              max={10}
              color="secondary"
            />
            <div className="flex lg:justify-end justify-center">
              <button
                className={
                  "w-32 py-1 my-3 mr-5 rounded-3xl text-white " +
                  (loading
                    ? "bg-slate-700 pointer-events-none"
                    : "bg-slate-500")
                }
              >
                작성
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
