import { createStore } from "redux";
import reducer from "./reducers/index";

let storeData = {};

// if (process.env.NODE_ENV === "development") {
//   let storeDataStr = sessionStorage.getItem("store");
//   try {
//     storeData = storeDataStr ? JSON.parse(storeDataStr) : {};
//   } catch (error) {
//     console.error(error);
//     storeData = {};
//   }
// }

const store = createStore(
  reducer,
  storeData,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

if (process.env.NODE_ENV === "development") {
  // store.subscribe(() => {
  //   console.log(store.getState());
  // });
  // document.addEventListener("beforeunload", () => {
  //   console.log("error");
  //   sessionStorage.setItem("store", JSON.stringify(store));
  // });
  // document.addEventListener("error", () => {
  //   console.log("error");
  //   //sessionStorage.setItem("store", JSON.stringify(store));
  // });
}

export default store;
