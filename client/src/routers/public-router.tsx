import React from "react";
import { Route, Routes } from "react-router-dom";
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
      </Routes>
    </React.Fragment>
  );
};
