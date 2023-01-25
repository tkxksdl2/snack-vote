import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CreateUser } from "../components/create-user";
import { Header } from "../components/header";
import { Main } from "../pages/main";
import { AgendaDetail } from "../pages/public/agenda-detail";

export const PublicRouter = () => {
  return (
    <React.Fragment>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/agenda/:id" element={<AgendaDetail />} />
        <Route path="/create-user/" element={<CreateUser />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </React.Fragment>
  );
};
