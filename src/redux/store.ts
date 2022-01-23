import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import blocksReducer from "./blocks/reducer";
import boardsReducer from "./boards/reducer";
import collaborationRequestsReducer from "./collaborationRequests/reducer";
import commentsReducer from "./comments/reducer";
import keyValueReducer from "./key-value/reducer";
import operationsReducer from "./operations/reducer";
import organizationsReducer from "./organizations/reducer";
import programAccessTokensReducer from "./programAccessTokens/reducer";
import roomsReducer from "./rooms/reducer";
import sessionReducer from "./session/reducer";
import sprintsReducer from "./sprints/reducer";
import tasksReducer from "./tasks/reducer";
import usersReducer from "./users/reducer";

const reducer = combineReducers({
  blocks: blocksReducer,
  users: usersReducer,
  session: sessionReducer,
  operations: operationsReducer,
  keyValue: keyValueReducer,
  rooms: roomsReducer,
  sprints: sprintsReducer,
  comments: commentsReducer,
  programAccessTokens: programAccessTokensReducer,
  organizations: organizationsReducer,
  boards: boardsReducer,
  tasks: tasksReducer,
  collaborationRequests: collaborationRequestsReducer,
});

const store = configureStore({
  reducer,
});

export default store;
