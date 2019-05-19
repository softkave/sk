import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import Router from "./Router";
import "./styles.css";
import "./sk-global.css";

if (process.env.NODE_ENV === "development") {
  require("antd/dist/antd.css");
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Provider>,
  rootElement
);
