import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { accessTokenVar, isLoggedInVar, refreshTokenIdVar } from "../apollo";
import { LOCAL_STARAGE_REFRESH_ID, LOCAL_STARAGE_TOKEN } from "../constants";
import { LoginMutation, LoginMutationVariables, MeQuery } from "../gql/graphql";
import { LOGIN } from "../queries/query-users";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "500px",
    padding: "3rem 2rem 1rem",
  },
};

interface ILoginModalProps {
  modalIsOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<MeQuery>>;
}

interface IForm {
  email: string;
  password: string;
}

Modal.setAppElement("#root");

export const LoginModal: React.FC<ILoginModalProps> = ({
  modalIsOpen,
  setIsOpen,
  refetch,
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  const onCompleted = async (data: LoginMutation) => {
    const { ok, error, accessToken, refreshTokenId } = data.login;
    if (ok && accessToken && refreshTokenId) {
      localStorage.setItem(LOCAL_STARAGE_TOKEN, accessToken);
      localStorage.setItem(LOCAL_STARAGE_REFRESH_ID, refreshTokenId + "");
      isLoggedInVar(true);
      accessTokenVar(accessToken);
      refreshTokenIdVar(refreshTokenId + "");
      await refetch();
      setIsOpen(false);
    } else {
      console.log(error);
    }
  };
  const [loginMutaion, { loading, data }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN, { onCompleted: onCompleted });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IForm>();

  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutaion({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };
  const onInvalid = () => {
    console.log("cant create account");
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <div className="flex flex-col w-full justify-center h-full text-gray-700">
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <div className="text-4xl font-semibold mb-5">로그인</div>
          {errors.email?.message ? (
            <div className="error-div">{errors.email.message}</div>
          ) : errors.password?.message ? (
            <div className="error-div">{errors.password.message}</div>
          ) : data?.login.error ? (
            <div className="error-div">{data?.login.error}</div>
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
          <div className="mt-5 mb-3 semibold">Password</div>
          <input
            {...register("password", { required: "Password를 입력해주세요" })}
            placeholder="Password"
            className="input"
            type="password"
          ></input>
          <div className="flex justify-center">
            <button
              className={`w-1/3 py-1 my-3 rounded-3xl text-white 
            ${loading ? "bg-slate-700 pointer-events-none" : "bg-slate-500"}`}
            >
              로그인
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to={"/create-user/"} onClick={closeModal}>
            <span className=" text-indigo-900 font-semibold">회원가입</span>
          </Link>
          /
          <span className=" text-indigo-900 font-semibold"> 비밀번호 찾기</span>
        </div>
      </div>
    </Modal>
  );
};
