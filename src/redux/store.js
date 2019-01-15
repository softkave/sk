import { createStore } from "redux";
import reducer from "./reducers/index";

let user = null;
if (process.env.NODE_ENV === "development") {
  user = JSON.parse(localStorage.getItem("user"));
}

const store = createStore(reducer, { user });

export default store;
