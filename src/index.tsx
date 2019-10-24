import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import IndexContainer from "./app/IndexContainer";
import store from "./redux/store";

import "./sk-global.css";
import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <IndexContainer />
    </Provider>
  </BrowserRouter>,
  rootElement
);
