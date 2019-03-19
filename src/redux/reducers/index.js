import update from "lodash/update";
import assign from "lodash/assign";
import unset from "lodash/unset";
import { MERGE, DELETE, MULTIPLE, SET } from "../constants/reducer";
import dotProp from "dot-prop-immutable";

export default function reducer(state, action, recursive) {
  console.log(action);
  function getNewState() {
    if (recursive) {
      return state;
    }

    return assign({}, state);
  }

  switch (action.type) {
    case MERGE:
      return dotProp.merge(state, action.path, action.data);
    // return update(getNewState(), action.path, data => {
    //   if (typeof data === typeof action.data) {
    //     if (Array.isArray(data)) {
    //       return [...data, ...action.data];
    //     } else if (typeof data === "object") {
    //       return { ...data, ...action.data };
    //     }
    //   }

    //   return action.data;
    // });

    case SET:
      return dotProp.set(state, action.path, action.data);

    case DELETE:
      return dotProp.delete(state, action.path);
    // state = getNewState();
    // unset(state, action.path);
    // return state;

    case MULTIPLE:
      return action.actions.reduce(
        (accumulator, todo) => reducer(accumulator, todo, true),
        state // getNewState()
      );

    default:
      return state;
  }
}
