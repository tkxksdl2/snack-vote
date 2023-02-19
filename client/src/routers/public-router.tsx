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

export const PublicRouter = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const privateRoutes = [
    ...Object.values(Category).map((c) => ({
      path: `/${c.toLowerCase()}/create-agenda/`,
      element: <CreateAgenda category={c} />,
    })),
  ];

  return (
    <React.Fragment>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/agenda/:id" element={<AgendaDetail />} />
        <Route path="/create-user/" element={<CreateUser />} />
        <Route path="*" element={<Navigate to={"/"} />} />
        {Object.values(Category).map((c) => (
          <Route
            key={`category-${c}`}
            path={`/${c.toLowerCase()}`}
            element={<AgendasCategory category={c} />}
          />
        ))}
        {isLoggedIn &&
          privateRoutes.map(({ path, element }, i) => (
            <Route key={`private-${i}`} path={path} element={element} />
          ))}
      </Routes>
    </React.Fragment>
  );
};
