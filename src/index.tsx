import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import Main from "./app/Main";
import store from "./redux/store";
import { serviceWorkerInit } from "./serviceWorkerRegistration";
import "./index.css";
import "./App.less";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://c416dce16a3f4dddab7adf82a64b6227@o881673.ingest.sentry.io/5836122",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Main />
    </Provider>
  </BrowserRouter>,
  rootElement
);

serviceWorkerInit();
