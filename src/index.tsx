import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import assert from "assert";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Main from "./app/Main";
import "./index.css";
import store from "./redux/store";
import { serviceWorkerInit } from "./serviceWorkerRegistration";

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

const container = document.getElementById("app");
assert(container, "container is not found");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  // @ts-ignore
  <BrowserRouter>
    {/* @ts-ignore */}
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Work Sans", "Segoe UI", Roboto, "Helvetica Neue",' +
              'Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",' +
              '"Noto Color Emoji"',
          },
        }}
      >
        <Main />
      </ConfigProvider>
    </Provider>
  </BrowserRouter>
);

serviceWorkerInit();
