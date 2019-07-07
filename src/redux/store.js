import { createStore } from "redux";
import reducer from "./reducers/index";

let storeData = {};

const store = createStore(
  reducer,
  storeData,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
