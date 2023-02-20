import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  UserRole,
} from "../../gql/graphql";
import { CREATE_USER } from "../../queries/query-users";

interface Iform {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export const CreateUser = () => {
  const navigate = useNavigate();
  const onCompleted = (data: CreateUserMutation) => {
    const {
      createUser: { ok, error },
    } = data;
    if (ok) {
      alert("회원 가입이 완료되었습니다.");
      navigate("/");
    }
  };
  const [createUser, { loading, data }] = useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CREATE_USER, { onCompleted });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Iform>();
  const onSubmit = () => {
    const { email, password, name } = getValues();
    createUser({
      variables: {
        input: {
          email,
          password,
          name,
          role: UserRole.Client,
        },
      },
    });
  };
  return (
    <div className="flex min-h-screen h-full py-20 justify-center bg-slate-300 ">
      <div className="flex flex-col justify-center c-user-form bg-white rounded-md px-3 text-gray-700">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-4xl font-semibold mb-5">회원가입</div>
          {errors.email?.message ? (
            <div className="error-div">{errors.email.message}</div>
          ) : errors.password?.message ? (
            <div className="error-div">{errors.password.message}</div>
          ) : data?.createUser ? (
            <div className="error-div">{data?.createUser.error}</div>
          ) : (
            ""
          )}
          <div className="mt-2 mb-3">Email</div>
          <input
            {...register("email", {
              required: "Email을 입력해주세요",
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: "올바른 형식이 아닙니다",
              },
            })}
            placeholder="Email"
            className="input"
            type="email"
          ></input>
          <div className="mt-5 mb-3 semibold">NickName</div>
          <input
            {...register("name", { required: "닉네임을 입력해주세요" })}
            placeholder="name"
            className="input"
            type="text"
          ></input>
          <div className="mt-5 mb-3 semibold">Password</div>
          <input
            {...register("password", { required: "Password를 입력해주세요" })}
            placeholder="Password"
            className="input"
            type="password"
          ></input>
          <div className="flex justify-center">
            <button
              className={`submit-btn 
            ${loading ? " bg-slate-700 pointer-events-none" : "bg-slate-500"}`}
            >
              회원 가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
