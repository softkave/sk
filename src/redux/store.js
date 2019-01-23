import { createStore } from "redux";
import reducer from "./reducers/index";

let storeData = {};

if (process.env.NODE_ENV === "development") {
  let storeDataStr = sessionStorage.getItem("store");
  try {
    storeData = storeDataStr ? JSON.parse(storeDataStr) : {};
  } catch (error) {
    console.error(error);
    storeData = {};
  }
}

const store = createStore(reducer, storeData);

if (process.env.NODE_ENV === "development") {
  document.addEventListener("beforeunload", () => {
    console.log("error");
    sessionStorage.setItem("store", JSON.stringify(store));
  });

  document.addEventListener("error", () => {
    console.log("error");
    //sessionStorage.setItem("store", JSON.stringify(store));
  });
}

export default store;
