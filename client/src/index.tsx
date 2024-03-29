import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { BrowserRouter } from "react-router-dom";
import "./styles/styles.css";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <HelmetProvider>
          <GoogleOAuthProvider
            clientId={
              process.env.REACT_APP_CLIENT_ID
                ? process.env.REACT_APP_CLIENT_ID
                : ""
            }
          >
            <App />
          </GoogleOAuthProvider>
        </HelmetProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
