import {
  MERGE,
  DELETE,
  MULTIPLE,
  SET,
  CLEAR_STATE
} from "../constants/reducer";
import dotProp from "dot-prop-immutable";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case MERGE:
      return dotProp.merge(state, action.path, action.data);

    case SET:
      return dotProp.set(state, action.path, action.data);

    case DELETE:
      return dotProp.delete(state, action.path);

    case MULTIPLE:
      return action.actions.reduce(
        (accumulator, todo) => reducer(accumulator, todo, true),
        state
      );

    case CLEAR_STATE:
      return {};

    default:
      return state;
  }
}
