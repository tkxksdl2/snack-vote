import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CreateUser } from "../pages/public/create-user";
import { Header } from "../components/header";
import { Main } from "../pages/main";
import { AgendaDetail } from "../pages/public/agenda-detail";
import { AgendasCategory } from "../pages/public/agendas-category";
import { Category } from "../gql/graphql";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "../apollo";
import { CreateAgenda } from "../pages/private/create-agenda";
import { MyAgendas } from "../pages/private/my-agendas";
import { UpdateUser } from "../pages/private/update-user";
import { VotedOpinions } from "../pages/private/voted-opinions";
import { MyComments } from "../pages/private/my-comments";
import { Footer } from "../components/footer";

interface RoutesArray {
  path: string;
  element: JSX.Element;
}

export const PublicRouter = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const privateRoutes: RoutesArray[] = [
    ...Object.values(Category).map((c) => ({
      path: `/${c.toLowerCase()}/create-agenda/`,
      element: <CreateAgenda category={c} />,
    })),
    {
      path: "/my-agendas/",
      element: <MyAgendas />,
    },
    {
      path: "/my-comments/",
      element: <MyComments />,
    },
    {
      path: "/update-user/",
      element: <UpdateUser />,
    },
    { path: "/voted-op/", element: <VotedOpinions /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/agenda/:id" element={<AgendaDetail />} />
        <Route path="/create-user/" element={<CreateUser />} />
        <Route path="*" element={<Navigate to={"/"} />} />
        {Object.values(Category).map((c) => (
          <Route
            key={`category-${c}/`}
            path={`/${c.toLowerCase()}/:query?`}
            element={<AgendasCategory category={c} />}
          />
        ))}
        {isLoggedIn &&
          privateRoutes.map(({ path, element }, i) => (
            <Route key={`private-${i}`} path={path} element={element} />
          ))}
      </Routes>
      <Footer />
    </div>
  );
};
