import update from "lodash/update";
import assign from "lodash/assign";
import unset from "lodash/unset";
import { MERGE, DELETE, MULTIPLE } from "../constants/reducer";

export default function reducer(state, action, recursive) {
  console.log(arguments);
  function getNewState() {
    if (recursive) {
      return state;
    }

    return assign({}, state);
  }

  switch (action.type) {
    case MERGE:
      return update(getNewState(), action.path, data => {
        if (typeof data === typeof action.data) {
          if (Array.isArray(data)) {
            return [...data, ...action.data];
          } else if (typeof data === "object") {
            return { ...data, ...action.data };
          }
        }

        return action.data;
      });

    case DELETE:
      state = getNewState();
      unset(state, action.path);
      return state;

    case MULTIPLE:
      return action.actions.reduce(
        (accumulator, todo) => reducer(accumulator, todo, true),
        getNewState()
      );

    default:
      return state;
  }
}
