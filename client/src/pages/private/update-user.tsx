import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "../../gql/graphql";
import { UPDATE_USER } from "../../queries/query-users";
import "react-datepicker/dist/react-datepicker.css";
import { useMe } from "../../hooks/use-me";
import { useState } from "react";
import { client } from "../../apollo";
import { Helmet } from "react-helmet-async";
interface Iform {
  password: string;
  name: string;
}

export const UpdateUser = () => {
  const navigate = useNavigate();
  const { data: meData } = useMe();
  const [passShouldUpdate, setShould] = useState(false);
  const onPassShouldClick = () => {
    if (passShouldUpdate) {
      setValue("password", "");
      setShould(false);
    } else setShould(true);
  };
  const onCompleted = (data: UpdateUserMutation) => {
    const {
      updateUser: { ok, error },
    } = data;
    if (ok) {
      client.writeFragment({
        id: `User:${meData?.me.id}`,
        fragment: gql`
          fragment Me on User {
            name
          }
        `,
        data: {
          name: getValues("name"),
        },
      });
      alert("정보가 수정되었습니다.");
      navigate("/");
    }
  };
  const [updateUser, { loading, data }] = useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(UPDATE_USER, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Iform>();
  const onSubmit = () => {
    const { name, password } = getValues();
    if (meData)
      updateUser({
        variables: {
          input: {
            inputId: meData.me.id,
            name,
            password: passShouldUpdate ? password : null,
          },
        },
      });
  };
  return (
    <div className="flex min-h-screen h-full py-20 justify-center bg-slate-300 ">
      <div className="flex flex-col justify-center u-user-form bg-white rounded-md px-3 text-gray-700">
        <Helmet>
          <title>SnackVote</title>
        </Helmet>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-4xl font-semibold mb-5">회원정보 수정</div>
          {errors.password?.message ? (
            <div className="error-div">{errors.password.message}</div>
          ) : data?.updateUser ? (
            <div className="error-div">{data?.updateUser.error}</div>
          ) : (
            ""
          )}
          <div className="mt-3 mb-2 semibold">NickName</div>
          <input
            {...register("name", { required: "닉네임을 입력해주세요" })}
            placeholder="name"
            className="input"
            type="text"
            defaultValue={meData?.me.name}
          ></input>
          <div className="mt-3 mb-2 semibold">
            Password
            <span
              onClick={onPassShouldClick}
              className={
                "rounded-md ml-3 cursor-pointer select-none " +
                (passShouldUpdate ? "bg-blue-200" : "bg-gray-200")
              }
            >
              변경
            </span>
          </div>
          <input
            {...register("password")}
            placeholder="Password"
            className={"input " + (passShouldUpdate ? "" : " bg-gray-300")}
            type="password"
            disabled={!passShouldUpdate}
          ></input>
          <div className="flex justify-center">
            <button
              className={`submit-btn 
            ${loading ? " bg-slate-700 pointer-events-none" : "bg-slate-500"}`}
            >
              정보 수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
